import { Component, Input, input, viewChild } from '@angular/core';

import Swal from 'sweetalert2';

import { Address } from './edit-profile/address/address';
import { General } from './edit-profile/general/general';
import { Persnol } from './edit-profile/persnol/persnol';
import * as data from '../../../../shared/data/data/contacts/contacts';
import { Print } from '../../modal/print/print';

@Component({
  selector: 'app-profile-data',
  templateUrl: './profile-data.html',
  styleUrls: ['./profile-data.scss'],
  imports: [Address, General, Persnol, Print],
})
export class ProfileData {
  public editContact: boolean = false;
  public personal = data.contact;
  public statusData: data.contactData;
  public open: boolean = false;
  @Input() profileData: data.dataList;
  readonly data = input<data.contactData[]>();
  readonly getTaskData = input<data.contactData>();

  readonly PrintModal = viewChild<Print>('printModal');

  ngOnInit() {
    this.data()?.map(data => {
      if (data.status) {
        this.statusData = data;
      }
      const listNewData = this.statusData.data;
      const currentData = listNewData.filter((data: { status: boolean }) => {
        return data.status === true;
      });
      this.profileData = currentData[0];
    });
  }

  openHistory() {
    this.open = !this.open;
  }

  deleteContact() {
    Swal.fire({
      text: 'This contact will be deleted from your Personal Contacts and from the chat list too.',
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#EFEFEE !important',
      confirmButtonColor: 'var(--theme-default)',
    }).then((result: { isConfirmed: boolean; isDenied: boolean }) => {
      if (result.isConfirmed) {
      } else {
        Swal.fire('', 'Your contact is safe!');
      }
    });
  }
}
