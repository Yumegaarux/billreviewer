<?php

namespace billreview\backend\database;

use PDO;
use PDOException;

class Database {
    private static $instance = null;
    private $connection;
    private $config;

    private function __construct()
    {
        $host    = getenv('DB_HOST') ?: 'db';
        $name    = getenv('DB_NAME') ?: 'billreviewer';
        $user    = getenv('DB_USER') ?: 'root';
        $pass    = getenv('DB_PASS') ?: '';
        $charset = 'utf8mb4';

        try {
            $dsn = "mysql:host={$host};dbname={$name};charset={$charset}";
            $this->connection = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
            exit;
        }
    }

    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection(): PDO
    {
        return $this->connection;
    }

    public function prepare(string $query, array $params = []): \PDOStatement
    {
        $stmt = $this->connection->prepare($query);
        $stmt->execute($params);
        return $stmt;
    }

    public function fetch(string $query, array $params = [])
    {
        return $this->prepare($query, $params)->fetch();
    }

    public function fetchAll(string $query, array $params = []): array
    {
        return $this->prepare($query, $params)->fetchAll();
    }

    public function insert(string $query, array $params = []): string
    {
        $this->prepare($query, $params);
        return $this->connection->lastInsertId();
    }

    public function execute(string $query, array $params = []): int
    {
        return $this->prepare($query, $params)->rowCount();
    }

    private function connect(): void
    {
        try {
            $dsn = sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=%s',
                $this->config['host'],
                $this->config['port'],
                $this->config['database'],
                $this->config['charset']
            );

            $this->connection = new PDO(
                $dsn,
                $this->config['username'],
                $this->config['password'],
                $this->config['options']
            );

            // Set charset
            $this->connection->exec("SET NAMES {$this->config['charset']} COLLATE {$this->config['collation']}");
            
        } catch (PDOException $e) {
            throw new PDOException("Database connection failed: " . $e->getMessage());
        }
    }
}