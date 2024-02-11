import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { DrawWinner } from '../DrawWinner';
import { test, vi, expect, afterEach } from 'vitest';

const pickWinner = vi.fn();

afterEach(cleanup);

test('should disable pickWinner button if players count is empty', () => {
  render(<DrawWinner pickWinner={pickWinner} playersCount={0} />);
  expect(screen.getByRole('button')).toBeDisabled();
});

test('should success pickWinner', async () => {
  pickWinner.mockResolvedValue(void 0);
  render(<DrawWinner pickWinner={pickWinner} playersCount={2} />);
  await userEvent.click(screen.getByRole('button'));

  expect(pickWinner).toHaveBeenCalled();

  await waitFor(() => screen.getByText(/a winner has been picked/i));
});

test("should fail pickWinner if something wen't wrong", async () => {
  pickWinner.mockRejectedValueOnce({ error: { message: 'Reverted error' } });
  render(<DrawWinner pickWinner={pickWinner} playersCount={2} />);
  await userEvent.click(screen.getByRole('button'));

  expect(pickWinner).toHaveBeenCalled();

  await waitFor(() => screen.getByText(/reverted error/i));
});
