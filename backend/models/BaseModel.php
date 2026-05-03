<?php

namespace billreview\backend\models;

use billreview\backend\database\Database;

/**
 * Base Model Class
 * Provides common database operations for all models
 */
abstract class BaseModel
{
    protected $db;
    protected $table;
    protected $primaryKey = 'id';

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Find a record by ID
     * 
     * @param mixed $id
     * @return array|false
     */
    public function find($id)
    {
        $query = "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = :id";
        return $this->db->fetch($query, ['id' => $id]);
    }

    /**
     * Find all records
     * 
     * @param array $conditions
     * @param string $orderBy
     * @param int $limit
     * @param int $offset
     * @return array
     */
    public function findAll(array $conditions = [], string $orderBy = '', int $limit = 0, int $offset = 0): array
    {
        $query = "SELECT * FROM {$this->table}";
        $params = [];

        if (!empty($conditions)) {
            $whereClause = [];
            foreach ($conditions as $field => $value) {
                $whereClause[] = "{$field} = :{$field}";
                $params[$field] = $value;
            }
            $query .= " WHERE " . implode(' AND ', $whereClause);
        }

        if (!empty($orderBy)) {
            $query .= " ORDER BY {$orderBy}";
        }

        if ($limit > 0) {
            $query .= " LIMIT {$limit}";
            if ($offset > 0) {
                $query .= " OFFSET {$offset}";
            }
        }

        return $this->db->fetchAll($query, $params);
    }

    /**
     * Create a new record
     * 
     * @param array $data
     * @return string Last insert ID
     */
    public function create(array $data): string
    {
        $fields = array_keys($data);
        $placeholders = array_map(function($field) { return ":{$field}"; }, $fields);
        
        $query = "INSERT INTO {$this->table} (" . implode(', ', $fields) . ") VALUES (" . implode(', ', $placeholders) . ")";
        
        return $this->db->insert($query, $data);
    }

    /**
     * Update a record
     * 
     * @param mixed $id
     * @param array $data
     * @return int Number of affected rows
     */
    public function update($id, array $data): int
    {
        $fields = array_keys($data);
        $setClause = array_map(function($field) { return "{$field} = :{$field}"; }, $fields);
        
        $query = "UPDATE {$this->table} SET " . implode(', ', $setClause) . " WHERE {$this->primaryKey} = :id";
        
        $data['id'] = $id;
        return $this->db->execute($query, $data);
    }

    /**
     * Delete a record
     * 
     * @param mixed $id
     * @return int Number of affected rows
     */
    public function delete($id): int
    {
        $query = "DELETE FROM {$this->table} WHERE {$this->primaryKey} = :id";
        return $this->db->execute($query, ['id' => $id]);
    }

    /**
     * Count records
     * 
     * @param array $conditions
     * @return int
     */
    public function count(array $conditions = []): int
    {
        $query = "SELECT COUNT(*) as count FROM {$this->table}";
        $params = [];

        if (!empty($conditions)) {
            $whereClause = [];
            foreach ($conditions as $field => $value) {
                $whereClause[] = "{$field} = :{$field}";
                $params[$field] = $value;
            }
            $query .= " WHERE " . implode(' AND ', $whereClause);
        }

        $result = $this->db->fetch($query, $params);
        return (int) $result['count'];
    }

    /**
     * Check if record exists
     * 
     * @param mixed $id
     * @return bool
     */
    public function exists($id): bool
    {
        return $this->find($id) !== false;
    }
}
