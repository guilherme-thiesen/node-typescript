import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const findTransaction = transactionsRepository.find({ where: { id } });

    if (!findTransaction) {
      throw new AppError('Transaction not found', 400);
    }

    transactionsRepository.delete(id);

    const transaction = await transactionsRepository.findOne(id);

    if (transaction) {
      throw new AppError('Failed to delete transaction', 400);
    }
  }
}

export default DeleteTransactionService;
