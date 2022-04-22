import { render, screen, waitFor } from '@testing-library/react';
import { JoinForm } from '../JoinForm';
import userEvent from '@testing-library/user-event';
import { ethers } from 'ethers';

const joinLottery = jest.fn();

afterEach(() => {
  joinLottery.mockClear();
  joinLottery.mockReset();
});

test('should disable enter button if input is empty', () => {
  render(<JoinForm joinLottery={joinLottery} />);
  expect(screen.getByRole('button')).toBeDisabled();
});

test('should fail submit if entered amount is less than minimal', async () => {
  render(<JoinForm joinLottery={joinLottery} />);
  const input = screen.getByRole('textbox');
  const submitBtn = screen.getByRole('button');
  await userEvent.type(input, '0.001');
  expect(submitBtn).not.toBeDisabled();
  await userEvent.click(submitBtn);

  screen.getByText(/please enter at least 0.01 eth/i);
  expect(joinLottery).not.toHaveBeenCalled();
});

test('should success submit if entered amount is gte minimal', async () => {
  joinLottery.mockResolvedValueOnce(void 0);
  render(<JoinForm joinLottery={joinLottery} />);
  const input = screen.getByRole('textbox');
  const submitBtn = screen.getByRole('button');

  await userEvent.type(input, '0.1');
  await userEvent.click(submitBtn);

  await waitFor(() => screen.getByText(/waiting on transaction success/i));

  expect(joinLottery).toHaveBeenCalledWith({
    value: ethers.utils.parseEther('0.1'),
  });

  await waitFor(() => screen.getByText(/you have been entered/i));
});

test("should fail submit if something wen't wrong", async () => {
  joinLottery.mockRejectedValueOnce({ error: { message: 'Reverted error' } });
  render(<JoinForm joinLottery={joinLottery} />);
  const input = screen.getByRole('textbox');
  const submitBtn = screen.getByRole('button');

  await userEvent.type(input, '0.1');
  await userEvent.click(submitBtn);

  await waitFor(() => screen.getByText(/waiting on transaction success/i));

  expect(joinLottery).toHaveBeenCalledWith({
    value: ethers.utils.parseEther('0.1'),
  });

  await waitFor(() => screen.getByText(/reverted error/i));
});
