<?php

namespace billreview\backend\models;


class User extends BaseModel {
    protected $table = 'users';
    protected $primaryKey = 'id';

    public function getAllUsernames($username){
        $query = "SELECT username FROM {$this->table} WHERE username = :username";
        return $this->db->fetchAll($query, ['username' => $username]);
    }

    public function createAccount(array $userData) {
        $userData['password'] = password_hash($userData['password'], PASSWORD_BCRYPT);
        
        $userData['date_joined'] = date('Y-m-d');
        $userData['usertype_id'] = 2;  // default to regular user
        
        return $this->create($userData);
    }
}