<?php

namespace billreview\backend\models;


class User extends BaseModel {
    protected $table = 'users';
    protected $primaryKey = 'id';

    public function checkDuplicate($field, $value) {
        $query = "SELECT {$field} FROM {$this->table} WHERE {$field} = :value";
        return $this->db->fetchAll($query, ['value' => $value]);
    }

    public function createAccount(array $userData) {
        $userData['password'] = password_hash($userData['password'], PASSWORD_BCRYPT);
        
        $userData['date_joined'] = date('Y-m-d');
        $userData['usertype_id'] = 2;  // default to regular user


        return $this->create($userData);
    }
}