<?php
class DB {
    private $host;
    private $name;
    private $user;
    private $pass;
    private $pdo;

    public function __construct()
    {
        $this->host = getenv('DB_HOST');
        $this->name = getenv('DB_NAME');
        $this->user = getenv('DB_USER');
        $this->pass = getenv('DB_PASS');

        try {
            $this->pdo = new PDO("mysql:host=$this->host;dbname=$this->name", $this->user, $this->pass);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
        
    }

    public function getConnection()
    {
        return $this->pdo;
    }
}