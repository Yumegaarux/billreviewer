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

    public function getBillCommentsWithUser($billID) {
        $query = "SELECT r.*, u.fname, u.lname 
                  FROM reviews r
                  JOIN users u ON r.user_id = u.user_id
                  WHERE r.bill_id = :bill_id
                  ORDER BY r.created_at DESC";

        return $this->db->fetchAll($query, ['bill_id' => $billID]);
    }
}