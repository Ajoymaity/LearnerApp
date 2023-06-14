import { HttpClient } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  question: string = "";
  chapterTilte='light';
  userType = '';
  supportedUserTypeConfig: Array<any> = []
  selectedUserType: any;

  constructor(
    private router: Router,
    private barcodeScanner: BarcodeScanner
  ) {
    // this.supportedUserTypeConfig = [ {
    //   name: "Teacher",
    //   code: 'teacher',
    //   isActive: true,
    //   image: 'ic_teacher.svg'
    // },
    // {
    //   name: "Student",
    //   code: 'student',
    //   isActive: true,
    //   image: 'ic_student.svg'
    // }]
  }

  URLToObject(url: any) {
    let request: any = {};
    let pairs = url.split('?')[1].split('&');
    for (const ele of pairs) {
        if(!ele)
            continue;
        let pair = ele.split('=');
        request[pair[0]] = pair[1];
     }
     return request;
}
  openQRScanner() {
    if (this.userType) {
      this.barcodeScanner.scan().then(async (barcodeData) => {
        console.log('Barcode data', barcodeData);
        const requestParam: NavigationExtras = {
          state: this.URLToObject(barcodeData.text)
        }
        await this.router.navigate(['./chapter-details-option'], requestParam);
       }).catch(err => {
           console.log('Error', err);
       });
    }
  }

  async selectedUser(userType: string) {
    this.userType = userType;
    var contents: Array<any> = [];
    if (userType === 'student') {
      contents = [
        {type:"Quiz", selected: false, question: 'As a student, give me 5 MCQ with correct answer for this ' + this.chapterTilte},
        {type:"Summary", selected: false, question: 'As a student, give me an easy to understand summary of this ' + this.chapterTilte},
        {type:"Important Words", selected: false, question: 'As a student, tell me important words with their meanings about this chapter that I should learn'}];
    } else if (userType === 'teacher') {
      contents = [
        {type:"Quiz", selected: false, question: 'Generate 5 MCQ for this ' + this.chapterTilte},
        {type:"Summary", selected: false, question: 'Summarize ' + this.chapterTilte},
        {type:"Important Words", selected: false, question: 'how to teach ' + this.chapterTilte + ' with activities'}];
    }
  
    const requestParam: NavigationExtras = {
      state: {role: userType, contents, isQrCode: false, chapter: this.chapterTilte}
    }
    await this.router.navigate(['./chapter-details-option'], requestParam);
  }

}
