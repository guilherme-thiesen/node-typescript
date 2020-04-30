import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
  [props: string]: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balance = transactions.reduce(
      (prev: Balance, elem: Transaction) => {
        // eslint-disable-next-line no-param-reassign
        prev[elem.type] += elem.value * 1;
        // eslint-disable-next-line no-param-reassign
        prev.total += elem.type === 'income' ? elem.value * 1 : elem.value * -1;
        return prev;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    return balance;
  }
}

export default TransactionsRepository;
