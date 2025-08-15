import { QueryUtils, generateId } from '../utils/helpers';
import { FilterQuery } from '../types';
import path from 'path';

describe('QueryUtils', () => {
  const sampleData = [
    { id: '1', name: 'Alice', role: 'admin', age: 30, tags: ['developer', 'manager'] },
    { id: '2', name: 'Bob', role: 'user', age: 25, tags: ['designer'] },
    { id: '3', name: 'Charlie', role: 'admin', age: 35, tags: ['architect'] }
  ];

  describe('applyFiltering', () => {
    it('should return all data when no filter provided', () => {
      const result = QueryUtils.applyFiltering(sampleData, {});
      expect(result).toEqual(sampleData);
    });

    it('should filter by exact string match', () => {
      const filter: FilterQuery = { role: 'admin' };
      const result = QueryUtils.applyFiltering(sampleData, filter);
      expect(result).toHaveLength(2);
      expect(result.every(item => item.role === 'admin')).toBe(true);
    });

    it('should filter by number match', () => {
      const filter: FilterQuery = { age: 30 };
      const result = QueryUtils.applyFiltering(sampleData, filter);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alice');
    });

    it('should filter with wildcard search', () => {
      const filter: FilterQuery = { name: '*li*' };
      const result = QueryUtils.applyFiltering(sampleData, filter);
      expect(result).toHaveLength(2);
      expect(result.map(item => item.name)).toEqual(['Alice', 'Charlie']);
    });

    it('should filter by array inclusion', () => {
      const filter: FilterQuery = { tags: 'developer' };
      const result = QueryUtils.applyFiltering(sampleData, filter);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alice');
    });

    it('should handle non-existent properties', () => {
      const filter: FilterQuery = { nonExistent: 'value' };
      const result = QueryUtils.applyFiltering(sampleData, filter);
      expect(result).toHaveLength(0);
    });

    it('should ignore pagination parameters', () => {
      const filter: FilterQuery = { 
        role: 'admin',
        page: '1',
        limit: '10',
        offset: '0',
        sortBy: 'name',
        sortOrder: 'asc'
      };
      const result = QueryUtils.applyFiltering(sampleData, filter);
      expect(result).toHaveLength(2);
      expect(result.every(item => item.role === 'admin')).toBe(true);
    });

    it('should apply multiple filters with AND logic', () => {
      const filter: FilterQuery = { role: 'admin', age: 30 };
      const result = QueryUtils.applyFiltering(sampleData, filter);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alice');
    });
  });

  describe('applySorting', () => {
    it('should return original data when no sort field provided', () => {
      const result = QueryUtils.applySorting(sampleData);
      expect(result).toEqual(sampleData);
    });

    it('should sort by string field ascending', () => {
      const result = QueryUtils.applySorting(sampleData, 'name', 'asc');
      expect(result.map(item => item.name)).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should sort by string field descending', () => {
      const result = QueryUtils.applySorting(sampleData, 'name', 'desc');
      expect(result.map(item => item.name)).toEqual(['Charlie', 'Bob', 'Alice']);
    });

    it('should sort by number field ascending', () => {
      const result = QueryUtils.applySorting(sampleData, 'age', 'asc');
      expect(result.map(item => item.age)).toEqual([25, 30, 35]);
    });

    it('should sort by number field descending', () => {
      const result = QueryUtils.applySorting(sampleData, 'age', 'desc');
      expect(result.map(item => item.age)).toEqual([35, 30, 25]);
    });

    it('should handle sorting by non-existent field', () => {
      const result = QueryUtils.applySorting(sampleData, 'nonExistent', 'asc');
      expect(result).toEqual(sampleData); // Should not crash and return original order
    });
  });

  describe('applyPagination', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({ 
      id: i.toString(), 
      name: `Item ${i}` 
    }));

    it('should paginate data correctly', () => {
      const result = QueryUtils.applyPagination(largeData, 2, 10);
      expect(result.data).toHaveLength(10);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total).toBe(25);
      expect(result.pagination.totalPages).toBe(3);
    });

    it('should handle first page', () => {
      const result = QueryUtils.applyPagination(largeData, 1, 10);
      expect(result.data).toHaveLength(10);
      expect(result.data[0].name).toBe('Item 0');
      expect(result.data[9].name).toBe('Item 9');
    });

    it('should handle last page with remaining items', () => {
      const result = QueryUtils.applyPagination(largeData, 3, 10);
      expect(result.data).toHaveLength(5); // Only 5 items left on last page
      expect(result.data[0].name).toBe('Item 20');
    });

    it('should handle empty data', () => {
      const result = QueryUtils.applyPagination([], 1, 10);
      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });

    it('should handle page beyond available data', () => {
      const result = QueryUtils.applyPagination(largeData, 10, 10);
      expect(result.data).toEqual([]);
      expect(result.pagination.page).toBe(10);
      expect(result.pagination.total).toBe(25);
    });
  });
});

describe('FileUtils', () => {
  describe('file operations', () => {
    it('should generate valid file paths', () => {
      const testPath = path.join('data', 'test.json');
      expect(testPath).toBe(path.normalize('data/test.json'));
    });
  });
});

describe('Utility Functions', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });

    it('should generate IDs of consistent format', () => {
      const ids = Array.from({ length: 10 }, () => generateId());
      
      // All IDs should be non-empty strings
      ids.forEach(id => {
        expect(typeof id).toBe('string');
        expect(id.length).toBeGreaterThan(0);
      });
      
      // All IDs should be unique
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
