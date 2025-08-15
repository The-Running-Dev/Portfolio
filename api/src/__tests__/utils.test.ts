import { QueryUtils } from '../utils/helpers';

describe('QueryUtils', () => {
  const sampleData = [
    { id: '1', name: 'John', age: 25, role: 'admin' },
    { id: '2', name: 'Jane', age: 30, role: 'user' },
    { id: '3', name: 'Bob', age: 35, role: 'user' },
    { id: '4', name: 'Alice', age: 28, role: 'admin' }
  ];

  describe('applyFiltering', () => {
    it('should return all data when no filter is provided', () => {
      const result = QueryUtils.applyFiltering(sampleData, {});
      expect(result).toHaveLength(4);
    });

    it('should filter by exact match', () => {
      const result = QueryUtils.applyFiltering(sampleData, { role: 'admin' });
      expect(result).toHaveLength(2);
      expect(result.every(item => item.role === 'admin')).toBe(true);
    });

    it('should filter by multiple fields', () => {
      const result = QueryUtils.applyFiltering(sampleData, { 
        role: 'admin', 
        age: 25 
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John');
    });

    it('should handle wildcard search', () => {
      const result = QueryUtils.applyFiltering(sampleData, { 
        name: '*Jo*' 
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John');
    });

    it('should ignore pagination and sorting parameters', () => {
      const result = QueryUtils.applyFiltering(sampleData, { 
        page: '1',
        limit: '10',
        sortBy: 'name',
        role: 'user'
      });
      expect(result).toHaveLength(2);
      expect(result.every(item => item.role === 'user')).toBe(true);
    });
  });

  describe('applySorting', () => {
    it('should return original data when no sortBy is provided', () => {
      const result = QueryUtils.applySorting(sampleData);
      expect(result).toEqual(sampleData);
    });

    it('should sort by string field in ascending order', () => {
      const result = QueryUtils.applySorting(sampleData, 'name', 'asc');
      expect(result[0].name).toBe('Alice');
      expect(result[3].name).toBe('John');
    });

    it('should sort by string field in descending order', () => {
      const result = QueryUtils.applySorting(sampleData, 'name', 'desc');
      expect(result[0].name).toBe('John');
      expect(result[3].name).toBe('Alice');
    });

    it('should sort by numeric field', () => {
      const result = QueryUtils.applySorting(sampleData, 'age', 'asc');
      expect(result[0].age).toBe(25);
      expect(result[3].age).toBe(35);
    });
  });

  describe('applyPagination', () => {
    it('should paginate data correctly', () => {
      const result = QueryUtils.applyPagination(sampleData, 1, 2);
      
      expect(result.data).toHaveLength(2);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 2,
        total: 4,
        totalPages: 2
      });
    });

    it('should handle second page correctly', () => {
      const result = QueryUtils.applyPagination(sampleData, 2, 2);
      
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toEqual(sampleData[2]);
      expect(result.pagination.page).toBe(2);
    });

    it('should handle partial last page', () => {
      const result = QueryUtils.applyPagination(sampleData, 2, 3);
      
      expect(result.data).toHaveLength(1);
      expect(result.pagination.totalPages).toBe(2);
    });
  });

  describe('parseQueryParams', () => {
    it('should parse basic pagination parameters', () => {
      const query = { page: '2', limit: '5' };
      const result = QueryUtils.parseQueryParams(query);
      
      expect(result.page).toBe('2');
      expect(result.limit).toBe('5');
    });

    it('should set default values', () => {
      const query = {};
      const result = QueryUtils.parseQueryParams(query);
      
      expect(result.page).toBe('1');
      expect(result.limit).toBe('10');
    });

    it('should enforce maximum limit', () => {
      const query = { limit: '200' };
      const result = QueryUtils.parseQueryParams(query);
      
      expect(result.limit).toBe('100');
    });

    it('should extract filter parameters', () => {
      const query = {
        page: '1',
        limit: '10',
        role: 'admin',
        status: 'active',
        sortBy: 'name'
      };
      const result = QueryUtils.parseQueryParams(query);
      
      expect(result.role).toBe('admin');
      expect(result.status).toBe('active');
      expect(result.sortBy).toBe('name');
    });

    it('should handle sort parameters', () => {
      const query = {
        sortBy: 'name',
        sortOrder: 'desc'
      };
      const result = QueryUtils.parseQueryParams(query);
      
      expect(result.sortBy).toBe('name');
      expect(result.sortOrder).toBe('desc');
    });

    it('should default sortOrder to asc', () => {
      const query = { sortBy: 'name' };
      const result = QueryUtils.parseQueryParams(query);
      
      expect(result.sortOrder).toBe('asc');
    });
  });
});
