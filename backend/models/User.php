<?php

namespace billreview\backend\models;


class User extends BaseModel {
    protected $table = 'users';
    protected $primaryKey = 'id';

    public function checkDuplicate($field, $value) {
        $query = "SELECT {$field} FROM {$this->table} WHERE {$field} = :value";
        return $this->db->fetchAll($query, ['value' => $value]);
    }

    public function createUser(array $userData) {
        $userData['password'] = password_hash($userData['password'], PASSWORD_BCRYPT);
        $userData['date_joined'] = date('Y-m-d');
        $userData['usertype_id'] = 2;  // default to regular user

        return $this->create($userData);
    }

    public function login($username, $password) {
        $query = "SELECT * FROM {$this->table} WHERE username = :username";
        $user = $this->db->fetch($query, ['username' => $username]);

        if ($user && password_verify($password, $user['password'])) {
            return $user;
        }
        return false;
    }
}