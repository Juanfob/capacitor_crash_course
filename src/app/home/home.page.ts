import { Component } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Contacts } from '@capacitor-community/contacts';

import { DomSanitizer } from '@angular/platform-browser';
import { isPlatform } from '@ionic/core';

const printCurrentPosition = async () => {
  const coordinates = await Geolocation.getCurrentPosition();
  console.log('Current position:', coordinates);
  console.log('date: ', coordinates.timestamp);
  const fecha = new Date(coordinates.timestamp);
  console.log('fecha: ', fecha);

  const wait = Geolocation.watchPosition({}, (position, err) => {
    console.log('Changed: ', position);
  });
};
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  imagen: any;
  contacts = [];

  constructor(private sanitizer: DomSanitizer) {
    printCurrentPosition();
    this.loadContacts();
  }

  async loadContacts() {
    if(isPlatform('android')){
      console.log('Android');
      const permission = await Contacts.getPermissions();
      if (!permission.granted){
        return;
      }
    }

    Contacts.getContacts().then(result => {
      console.log(result);
      this.contacts = result.contacts;
    });
  }

  openBrowser() {
    Browser.open({ url: 'http://capacitorjs.com/' });
  }

  async captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });

    console.log('imagen: ', image);
    this.imagen = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/jpeg;base64,${image.base64String}`);
  }

  clearImage(){
    this.imagen = '';
  }

}
