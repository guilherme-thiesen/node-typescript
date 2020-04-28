import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findOrInsert(title: string): Promise<string | null> {
    if (!title) {
      return null;
    }

    let savedCategory = await this.findOne({ title });

    if (!savedCategory) {
      const preparedCategory = this.create({ title });
      savedCategory = await this.save(preparedCategory);
    }

    return savedCategory.id;
  }
}

export default CategoriesRepository;
