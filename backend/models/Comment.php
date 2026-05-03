<?php

namespace billreview\backend\models;

class Comment extends BaseModel {
    protected $table = 'reviews';
    protected $primaryKey = 'id';

    protected $fillable = [
        'bill_id',
        'user_id',
        'body',
        'created_at',
        'rating'
    ];

    public function getBillComments($billID){
        return $this->findAll(['bill_id' => $billID]);
    }
}