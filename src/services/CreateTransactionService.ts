// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';
import CategoryRepository from '../repositories/CategoriesRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Transaction type not valid');
    }

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Insuficient Funds');
    }

    const category_id = await categoryRepository.findOrInsert(category);

    const prepareTransaction = transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    const savedTransaction = await transactionRepository.save(
      prepareTransaction,
    );

    return savedTransaction;
  }
}

export default CreateTransactionService;
