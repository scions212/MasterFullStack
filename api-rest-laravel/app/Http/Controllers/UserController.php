<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\User;

class UserController extends Controller
{

   
    // 

    public function pruebas(Request $request){
        return "Accion de pruebas de user-controller";
    }

    public function register(Request $request){

        //recoger Datos Usuario por post
        $json = $request->input('json', null);
        $params = json_decode($json);// objeto
        $params_array = json_decode($json, true); //array

        if(!empty($params) && !empty($params_array)){
       
            //limpiar Datos
        $params_array = array_map('trim', $params_array);

        //validar Datos
        $validate = \Validator::make($params_array, [
            'name' => 'required|alpha',
            'surname' => 'required|alpha',
            'email' => 'required|email|unique:users',
            'password' => 'required',
        ]);
            //Validacion Fallida
        if ($validate->fails()) {
            $data = array(
                'status'=> 'error',
                'code' => 404,
                'message' => 'No se pudo ingresar el usuario',
                'errors'=>  $validate->errors()
            );
           
        }else{
        //Validacion pasada correctamente
                 
        //cifrar contraseña
            $pwd= hash('sha256', $params->password);
        
        //Crear Usuario
            $user= new User();
            $user->name = $params_array['name'];
            $user->surname= $params_array['surname'];
            $user->email =$params_array['email'];
            $user ->role= 'ROLE_USER';//$params_array['role'];
            $user->password =$pwd; 

            $user->save();

            $data = array(
                'status'=> 'success',
                'code' => 200,
                'message' => 'El usuario se ha creado correctamente',
                'USER'=> $user
            );
        }
    } else {
        $data = array(
            'status'=> 'error',
            'code' => 403,
            'message' => 'Los Datos no son correctos', 
        );
    }
        return response()-> json ($data, $data['code']);
    }

    public function login(Request $request){
        $jwtAuth = new \JwtAuth();

        //recibir datos por post
        $json = $request->input('json',null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);

        //validar los datos
        $validate = \Validator::make ($params_array ,[
            'email' => 'required|email',
            'password' => 'required',
        ]);
          
        if ($validate->fails()) {
              //Validacion Fallida
            $signup = array(
                'status'=> 'error',
                'code' => '403',
                'message' => 'No se Usuario no se pudo identificar',
                'errors'=>  $validate->errors()
            );
           
        }else{
                //cifrar la contraseña

                
                $pwd = hash('sha256',  $params->password);
                //devo lver token o datos
                $signup = $jwtAuth->signup($params->email, $pwd);

                if(!empty($params->gettoken)){
                    $signup = $jwtAuth->signup($params->email, $pwd, true);
                }
        }
             return response()->json($signup,200 );
 
    } 

    public function update(Request $request){
       //Comprobacion si el usuario esta identificado
        $token = $request->header('Authorization');
        $jwtAuth = new \JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);

            //recoger los datos por post
            $json = $request->input('json', null);
            $params_array = json_decode($json, true);
            
        if($checkToken && !empty($params_array)){

                //Actualizar usuario
                   
                //Sacar usuario identificado 
                $user = $jwtAuth->checkToken($token ,true);
             
                //Validar los datos
                $validate = \Validator::make($params_array , [
                    'name' => 'required|string',
                    'surname' => 'required|string',
                    'email' => 'required|email|unique:users,'.$user->sub 
                ]);

                //quitar los campos que no quiero actualizar
                    unset($params_array['id']);
                    unset($params_array['password']);
                    unset($params_array['created_at']);
                    unset($params_array['remember_token']);

                //actualizar usuario en bbdd
                    $user_update = User::where('id', $user->sub)->update($params_array);

                //devolver array con resultado
                    $data = array(
                        'code' => 200,
                        'status' => 'Success',
                        'user' => $user,
                        'changes'=> $params_array
                    );
        }else{
            $data =array(
                'code'=> 400,
                'status' =>'error',
                'message' => 'el usuario no esta identificado;'
            );
        }
          return response()->json($data, $data['code']);
    }

    public function upload(Request $request){

        //recoger los datos de la peticion
            $image = $request->file('file0');


        //validacion de imagen
        $validate = \Validator::make($request->all(), [
            'file0' => 'required|image|mimes:jpg,jpeg,png,gif,JPG,JPEG'
        ]);

        //Guardar imagen
           if(!$image || $validate->fails()){
            $data  = array(
                'code'=> 400,
                'status' =>'error',
                'message' => 'Error no se pudo subir la imagen'
                );
            }else{
                $image_name = time().$image->getClientOriginalName();
                \Storage::disk('users')->put($image_name, \File::get($image));

                $data=array(
                    'code' => 200,
                    'status' => 'Success',
                    'image' => $image_name,
                );
        }
        return response()->json($data, $data['code']);
    }

    public function getImage($file_name){
        $isset=\Storage::disk('users')->exists($file_name);

        if($isset){      
        $file =  \Storage::disk('users')->get($file_name);
        
        return new Response($file,200);
        
        }else{
                $data=array(
                    'code' => 404,
                    'status' => 'Error',
                    'message' => 'Imagen no existe',
                );
            return response()->json($data, $data['code']);
        }
    }

    public function detail($id){
        $user = User::find($id);

        if (is_object($user)) {
            $data = array(
                'code' =>  200,
                'status' =>  'success',
                'user' =>  $user
            );
        }else{
            
            $data = array(
                'Code' =>  404,
                'Status' =>  'Error',
                'Message' =>  'El usuario no existe'
                );
            }
        return response()->json($data, $data['code']);
    }
}
