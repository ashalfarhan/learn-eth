/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface LotteryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "getPlayers"
      | "getTotalPlayers"
      | "join"
      | "manager"
      | "pickWinner"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getPlayers",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalPlayers",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "join", values?: undefined): string;
  encodeFunctionData(functionFragment: "manager", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pickWinner",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "getPlayers", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTotalPlayers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "join", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "manager", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pickWinner", data: BytesLike): Result;
}

export interface Lottery extends BaseContract {
  connect(runner?: ContractRunner | null): Lottery;
  waitForDeployment(): Promise<this>;

  interface: LotteryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  getPlayers: TypedContractMethod<[], [string[]], "view">;

  getTotalPlayers: TypedContractMethod<[], [bigint], "view">;

  join: TypedContractMethod<[], [void], "payable">;

  manager: TypedContractMethod<[], [string], "view">;

  pickWinner: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getPlayers"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "getTotalPlayers"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "join"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "manager"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "pickWinner"
  ): TypedContractMethod<[], [void], "nonpayable">;

  filters: {};
}
