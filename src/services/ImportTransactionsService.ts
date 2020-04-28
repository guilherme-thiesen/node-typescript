import path from 'path';
import csvtojson from 'csvtojson';
import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';
import uploadConfig from '../config/uploadConfig';
import CategoryRepository from '../repositories/CategoriesRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

interface CategoryArray {
  [propName: string]: string;
}

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const transactions: Transaction[] = [];

    const transactionRepository = getRepository(Transaction);

    const categoryRepository = getCustomRepository(CategoryRepository);

    const filePath = path.join(uploadConfig.directory, filename);

    const importedTransactions: Request[] = await csvtojson().fromFile(
      filePath,
    );

    const uniqueCategories: CategoryArray = {};
    importedTransactions.map(async transaction => {
      const { category: title } = transaction;
      if (title && !uniqueCategories[title]) {
        uniqueCategories[title] = '';
      }
      return false;
    });

    await Promise.all(
      Object.keys(uniqueCategories).map(async title => {
        const findCategoryId = await categoryRepository.findOrInsert(title);
        uniqueCategories[title] = findCategoryId || uniqueCategories[title];

        return false;
      }),
    );

    await Promise.all(
      importedTransactions.map(async transaction => {
        const { type, title, value, category } = transaction;

        if (type !== 'income' && type !== 'outcome') {
          throw new AppError('Transaction type not valid');
        }

        const prepareTransaction = transactionRepository.create({
          title,
          value,
          type,
          category_id: uniqueCategories[category],
        });

        const savedTransaction = await transactionRepository.save(
          prepareTransaction,
        );

        transactions.push(savedTransaction);
      }),
    );

    return transactions;
  }
}

export default ImportTransactionsService;
