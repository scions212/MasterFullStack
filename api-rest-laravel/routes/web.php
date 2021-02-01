<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PruebasController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;

use App\Http\Controllers\Controller;

//cargar clases
use App\Http\Middleware\ApiAuthMiddleware;

//rutas de pruebas 
Route::get('/', function () {
    return '<h1>Hola mundo Laravel</h1>';
});

Route::get('/welcome', function () {
    return view('welcome');
});


Route::get('/pruebas/{nombre?}', function($nombre='Andres') {
    $texto = '<h2>Hola esto es la vista de prueba</h2>';
    $texto .= 'el nombre es: '.$nombre;

      return view('pruebas', array(
        'texto' => $texto

    ));
});

Route::get('animales', [PruebasController::class, 'index']);
Route::get('test-orm', [PruebasController::class, 'testOrm']);


//Rutas api Pruebas
Route::get('Usuario-prueba', [UserController::class, 'pruebas']);
Route::get('Category-prueba', [CategoryController::class, 'pruebas']);
Route::get('Post-prueba', [PostController::class, 'pruebas']);
   

//Rutas USER 
Route::post('Api/User/Register', [UserController::class, 'register']);
Route::post('Api/User/Login', [UserController::class, 'login']);
Route::put('Api/User/Update', [UserController::class, 'update']);
Route::post('Api/User/Upload', [UserController::class, 'upload'])->middleware(ApiAuthMiddleware::class);
Route::get('Api/User/Avatar/{filename}', [UserController::class, 'getImage']);
Route::get('Api/User/Detail/{id}', [UserController::class, 'detail']);

//Rutas Category
Route::get('Api/Category/GetCategory', [CategoryController::class, 'getCategorys']);
Route::get('Api/Category/GetCategory/{id}', [CategoryController::class, 'getCategory']);
Route::post('Api/Category/CreateCategory', [CategoryController::class, 'createCategory']);
Route::put('Api/Category/UpdateCategory/{id}', [CategoryController::class, 'update']);


//Rutas Post

Route::get('Api/Post/GetPosts', [PostController::class, 'getPosts']);
Route::get('Api/Post/GetPost/{id}', [PostController::class, 'getPost']);
Route::post('Api/Post/CreatePost', [PostController::class, 'createPost']);
Route::put('Api/Post/UpdatePost/{id}', [PostController::class, 'updatePost']);
Route::delete('Api/Post/DeletePost/{id}', [PostController::class, 'deletePost']);
Route::post('Api/Post/Upload/{id}', [PostController::class, 'uploadPost'])->middleware(ApiAuthMiddleware::class);
Route::post('Api/Post/Image/{filename}', [PostController::class, 'getImagen'])->middleware(ApiAuthMiddleware::class);
Route::get('Api/Post/CategoryPost/{id}', [PostController::class, 'getPostByCategory']);
Route::get('Api/Post/UserPost/{id}', [PostController::class, 'getPostByUser']);
