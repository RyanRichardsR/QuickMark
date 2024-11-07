import 'dart:convert';
import 'package:http/http.dart' as http;

const baseURL = 'http://10.0.2.2:3000/api';

class ServerCalls 
{
  var client = http.Client();

  //Get
  Future<dynamic> get(String api, Map<String, dynamic> map) async {
    var url = Uri.parse(baseURL + api);
    var res = await client.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    );
    if (res.statusCode == 200) {
      return json.decode(res.body);
    } else {
      throw Exception('Failed to get data: ${res.reasonPhrase}');
    }
  }

  //Post
  Future<dynamic> post(String api, Map<String, dynamic> body) async {
    var url = Uri.parse(baseURL + api);
    var res = await client.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: json.encode(body)
    );
    if (res.statusCode == 200 || res.statusCode == 201) {
      return json.decode(res.body);
    } else {
      throw Exception('Failed to post data: ${res.reasonPhrase}');
    }
  }


  Future<dynamic> put(String api) async {}

  Future<dynamic> delete(String api) async {}


}