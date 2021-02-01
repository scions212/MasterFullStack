<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Post;
use App\Category;
use App\User;

class PruebasController extends Controller
{
    //public

    public function index(){
        $titulo = 'Animales';
        $animales = ['Cat','Dog','Chickens','Cows'];

         return view('pruebas.index', array(
            'titulo' => $titulo,
            'animales' => $animales
         ));
    }

    public function testOrm(){
/*
        $posts = Post::all();
        foreach($posts as $post){
            echo "<h1>".$post->title."</h1>";
            echo "<span style='color:red';> <strong>  {$post->user->name} - {$post->category->name} </strong></span>";
            echo "<p>".$post->content."</p>";
            echo "<hr>";
        }
*/
        $category = Category::all();
            foreach($category as $categorys){
                echo "<h1>".$categorys->name."</h1>";

                foreach($categorys->posts as $post){
                    echo "<h1>".$post->title."</h1>";
                    echo "<span style='color:red';> <strong>  {$post->user->name} - {$post->category->name} </strong></span>";
                    echo "<p>".$post->content."</p>";
                    echo "<hr>";
                
            }
            echo "<hr>";
        } 
        die();
    }
}
