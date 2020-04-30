import path from 'path';
import csvtojson from 'csvtojson';
import CreateTransactionService from './CreateTransactionService';
import uploadConfig from '../config/uploadConfig';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
  category_id: string;
}

interface ImportedFiles {
  filename: string;
}

class ImportTransactionsService {
  async execute(files: ImportedFiles[]): Promise<Transaction[]> {
    const transactions: Transaction[] = [];
    const filesLenght = files.length;
    const createTransaction = new CreateTransactionService();

    for (let fileIndex = 0; fileIndex < filesLenght; fileIndex += 1) {
      const filePath = path.join(
        uploadConfig.directory,
        files[fileIndex].filename,
      );

      // eslint-disable-next-line no-await-in-loop
      const importedTransactions: Request[] = await csvtojson().fromFile(
        filePath,
      );

      const lenght = importedTransactions.length;
      for (let index = 0; index < lenght; index += 1) {
        const { title, type, value, category } = importedTransactions[index];

        // eslint-disable-next-line no-await-in-loop
        const savedTransaction = await createTransaction.execute({
          title,
          type,
          value,
          category,
        });
        transactions.push(savedTransaction);
      }
    }

    return transactions;
  }
}

export default ImportTransactionsService;
