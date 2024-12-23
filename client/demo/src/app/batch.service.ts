import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
url="http://localhost:5300/api"
  constructor(private http:HttpClient) { }
  getData(){
    return this.http.get(`${this.url}/read`)
  }
  postData(data:any){
    return this.http.post(`${this.url}/insert`,data)
  }
  deleteBatch(id:any){
    return this.http.delete(`${this.url}/delete/${id}`)
  }
  updateRecord(id:any,data:any){
return this.http.put(`${this.url}/update/${id}`,data)
  }
  getBatchByID(id: any) {
    console.log('Fetching data for ID:', id); // Debugging log
    return this.http.get(`${this.url}/getByid/${id}`);
  }
  
}
