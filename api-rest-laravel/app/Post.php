<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
   protected $table = "posts";

   protected $fillable = ['title','content','category_id'];
   //Relacion de uno a muchos pero inversa de muchos a uno

   public function user(){
       return $this->beLongsTo("App\User", "user_id");
       }

    public function category(){
        return $this->beLongsTo("App\Category", "category_id");
        }
    
}
