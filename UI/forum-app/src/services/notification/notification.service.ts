import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message : string, title : string){
    this.toastr.success(message, title)
  }

  showError(message : string, title : string){
    this.toastr.error(message, title)
  }

  showInfo(message: string){
    this.toastr.info(message,"Info");
  }

  showWarning(message:string){
    this.toastr.warning(message,"Warning");
  }

  clear(){
    this.toastr.clear();
  }

}
