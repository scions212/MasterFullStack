<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Category;

class CategoryController extends Controller
{
    //

    public function __construct(){
        $this->middleware('api.auth', ['except'=>['getCategorys','getCategory']]);
    }

    public function getCategorys(){
     $categorys= Category::all();

     return response()->json([
         'code' => 200,
         'status' => 'Success',
         'category' => $categorys
     ]);
    }

    public function getCategory($id){
        $category= Category::find($id);

        if(is_object($category)){
            $data = [
                'code' => 200,
                'status' => 'Success',
                'category' => $category 
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

    public function createCategory(Request $request){
         //Comprobacion si el usuario esta identificado
            /*$token = $request->header('Authorization');
            $jwtAuth = new \JwtAuth();
            $checkToken = $jwtAuth->checkToken($token);
 */
        //recoger los datos por post
             $json = $request->input('json', null);
             $params_array = json_decode($json, true);

             if(!empty($params_array)){

                //Sacar usuario identificado 
               // $user = $jwtAuth->checkToken($token ,true);
             
        //validar los datos
            $validate = \Validator::make($params_array, [
                'name' => 'required|string',
            ]);
        //guardar la categoria
            if($validate->fails()){
                $data=[ 
                    'code' => 400,
                    'status' => 'Error',
                    'mesage' => 'No se ha guardado la Categoria'
                ];
            }else{
                    $categorys = new Category();
                    $categorys->name = $params_array['name'];
                    $categorys->save();

                    $data=[ 
                        'code' => 200,
                        'status' => 'Success',
                        'Category' => $categorys
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

    public function update($id, Request $request){
         //recoger los datos por post
         $json = $request->input('json', null);
         $params_array = json_decode($json, true); 

         if(!empty($params_array)){
        // Validar los Datos

        $validate = \Validator::make($params_array, [
            'name' => 'required|string',
        ]);

        //Quitar lo que no quiero actualizar
            unset($params_array['id']);
            unset($params_array['created_at']);
            
        //Actualizar el registro
        $categorys = Category::where('id', $id)->update($params_array);
            $data=[ 
                'code' => 200,
                'status' => 'Success',
                'Category' => $params_array
            ];
        }else{
            $data=[ 
                'code' => 400,
                'status' => 'Error',
                'mesage' => 'No Has enviado ninguna categoria'
            ];
        }
        ///devolver respuesta
            return response()->json($data, $data['code']); 
    }
}
