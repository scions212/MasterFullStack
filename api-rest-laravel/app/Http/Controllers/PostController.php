<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Post;
use App\Helpers\JwtAuth;

class PostController extends Controller
{
    

    public function __construct(){
        $this->middleware('api.auth', ['except'=>['']]);
    }

    //
    public function pruebas(Request $request){
        return "Accion de pruebas de user-controller";
    }

    public function getPosts(){

        $posts = Post::all();
        return response()->json([
            'code' => 200,
            'status' => 'Success',
            'Posts' => $posts
        ]);
       }
  

    public function getPost($id){
        $post= Post::find($id);

        if(is_object($post)){
            $data = [
                'code' => 200,
                'status' => 'Success',
                'Post' => $post 
            ];
        }else{
                $data=[
                    'code' => 404,
                    'status' => 'Error',
                    'Message' => 'La Categoria no existe'
                ];   
        }
        return response()->json($data, $data['code']); 
    }

    public function createPost(Request $request){
        //REcoger datos por post

            $json = $request->input('json', null);
            $params = json_decode($json);
            $params_array = json_decode($json, true);
           
            if(!empty($params_array)){
                //Sacar usuario identificado 
                $user = $this->getIdentity($request);
             
        //validar los datos
            $validate = \Validator::make($params_array->all(), [
                'title' => 'required',
                'content' => 'required',
                'category_id'  => 'required',
                'image'  => 'required'
            ]);
        //guardar la categoria
            if($validate->fails()){
                $data=[ 
                    'code' => 400,
                    'status' => 'Error',
                    'mesage' => 'No se ha guardado el Post, faltan datos'
                ];
                }else{
                        $post = new Post();
                        $post->user_id = $user->sub;
                        $post->category_id = $params->category_id;
                        $post->title = $params->title;
                        $post->content = $params->content;
                        $post->image = $params->image;
                        $post->save();
    
                        $data=[ 
                            'code' => 200,
                            'status' => 'Success',
                            'post' => $post
                        ];
                    }
                }else{
                    $data=[ 
                        'code' => 400,
                        'status' => 'Error',
                        'mesage' => 'No Has enviado ninguna categoria'
                    ];
                }
            //devolver resultado
                return response()->json($data, $data['code']); 
        }    

        public function updatePost($id, Request $request){
        //recoger los datos por post
        $json = $request->input('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);

            //Datos para devolver
         $data = [
            'code' => 400,
            'status' => 'Error',
            'message'=> 'Los Datos enviados son incorrecto'
        ];

         if(!empty($params_array)){

            $jwtAuth = new JwtAuth();
            $token = $request->header('Authorization', null); 
            $user = $jwtAuth->checkToken($token ,true);

            // Validar los Datos
            $validate = \Validator::make($params_array->all(), [
                'title' => 'required',
                'content' => 'required',
                'category_id' => 'required'
            ]);

            if($validate->fails()){
                $data['errors'] = $validate->errors();
                return response()->json($data, $data['code']);
            }

            //Quitar lo que no quiero actualizar
            unset($params_array['id']);
            unset($params_array['user_id']);
            unset($params_array['created_at']);
            unset($params_array['user']);

            //conseguir usuario identificado
            $user = $this->getIdentity($request);

             //conseguir el registro
            $post = Post::where('id', $id)
            ->where('user_id', $user->sub)
            ->first();

        if(!empty($post) && is_object($post)){
             
            //ACtualizar registro en concreto
            $post->update($params_array);

            //devolver mensaje exitoso
        $data = [
            'code' => 200,
            'status' => 'Success',
            'post' => $post,
            'changes' => $params_array
            ];

        }else{
        $data = [
            'code' => 400,
            'status' => 'Error',
            'message'=> 'Los Datos enviados son incorrecto',
            'post' => $post,
            'changes' => $params_array
            ];
        }
    
        ///devolver respuesta
            return response()->json($data, $data['code']); 
    }
}

    public function deletePost($id, Request $request){

        //conseguir el usuario  
        $user = $this->getIdentity($request);

      //conseguir el registro
      $post = Post::where('id', $id)
                    ->where('user_id', $user->sub)
                    ->first();


      if(!empty($post)){
          //Borrarlo
        $post->delete();

        $data = [
            'code' => 200,
            'status' =>  'Success',
            'post' => $post
        ];
      }else{      
            $data=[
            'code' => 400,
            'status' =>  'Error',
            'Message' => 'Error al borrar el post, Verifique si el post fue creado por su Usuario'
        ];
    }
        return response()->json($data, $data['code']); 
    }

    private function getIdentity(Request $request){

        $jwtAuth = new JwtAuth();
        $token = $request->header('Authorization', null); 
        $user = $jwtAuth->checkToken($token ,true);
        
        return $user;

    }

    public function uploadPost(Request $request){
            //recoger la imagen de la peticion
            $image = $request->file('file0');

            //validar la imagen
            $validate = \Validator::make($request->all(), [
                'file0' => 'required|image|mimes:jpg,jpeg,gif,png,JPEG,JPG',
            ]);

            //guardar la imagen
            if(!$image || $validate->fails()){
                $data=[
                    'code' => 400,
                    'status' =>  'Error',
                    'Message' => 'Error al subir la imagen'
                ];
            }else{
                $image_name = time().$image->getClientOriginalName(); 
                
                \Storage::disk('images')->put($image_name, \File::get($image));
                
                $data=[
                    'code' => 200,
                    'status' =>  'Success',
                    'image' => $image_name
                ];
            }
            //devolver datos
            return response()->json($data, $data['code']); 
    }

    public function getImagen($filename){
        //Comprobar si existe el fichero
            $isset = \Storage::disk('images')->exists($filename);

            if($isset){
                //conseguir image
                $file = \Storage::disk('images')->get($filename);
                 
        //devolver la imagen
            return new Response($file, 200);

        //mostrar error
        }else{
             $data=[
            'code' => 404,
            'status' =>  'Error',
            'message' => 'La imagen no existe'
            ];
        }
    
        return response()->json($data, $data['code']); 
    }

    public function getPostByCategory($id){
        $post = Post::where('category_id', $id)->get();

        return response()->json([
            'Status' =>'sucess',
            'posts' => $post
        ],200);
    }

    public function getPostByUser($id){
        $posts = Post::where('user_id', $id)->get();
        return response()->json([
            'Status' =>'sucess',
            'posts' => $posts
        ],200);
    }
}



 
 