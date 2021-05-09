import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ForumForm from 'src/models/forum/ForumForm';
import { ForumService } from 'src/services/forum/forum.service';
import { EventEmitter } from '@angular/core';
import ForumView from 'src/models/forum/ForumView';
import { NotificationService } from 'src/services/notification/notification.service';

@Component({
  selector: 'app-boardcreate',
  templateUrl: './boardcreate.component.html',
  styleUrls: ['./boardcreate.component.scss']
})
export class BoardcreateComponent implements OnInit {

  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
  file : File;
  forum: ForumView;
  createForm : FormGroup;
  imgURL: any;
  loading : boolean;

  forumForm : ForumForm;
  borderColor : string;

  constructor(private formBuilder: FormBuilder, private forumService : ForumService, private notif : NotificationService) {
    this.forum = new ForumView();
    this.createForm = formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required]
    });

    this.forumForm = new ForumForm();
    this.borderColor = "border-gray-200";
  }


  ngOnInit(): void {
  }

  private uploadFiles() {
    this.fileUpload.nativeElement.value = '';
    this.uploadFile(this.file);
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    console.log(file);
  }

  onClick() {
    const fileUpload = this.fileUpload.nativeElement;fileUpload.onchange = () => {
      this.file =  fileUpload.files[0]
      var reader = new FileReader();
      reader.readAsDataURL(this.file);

      reader.onload = (_event) => {
        this.imgURL = reader.result;

        console.log(this.imgURL)
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }

  async onSubmitRegister(){
    this.forumForm.name = this.createForm.controls['name'].value;
    this.forumForm.description = this.createForm.controls['description'].value;
    this.forumForm.image = this.imgURL;

    this.forumForm.name = this.forumForm.name.trim();
    if(this.forumForm.name === undefined || this.forumForm.name === '') {
      this.borderColor = "border-danger";
      this.notif.showError("Please insert a correct forum name", "Error on input")
      return;
    }

    this.forumForm.description = this.forumForm.description.trim();
    if(this.forumForm.description === undefined || this.forumForm.description === '') {
      this.notif.showError("Please insert a correct forum description", "Error on input")
      return; }

    if(this.forumForm.image === undefined) {
      this.notif.showError("Please insert a image for your forum", "Error on input")
      return;
    }
    this.notif.showSuccess("Forum successfuly created !", "Success !")
    await this.forumService.createNewForumAsync(this.forumForm);
  }

}
