import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/ui-kits/typography';

@Component({
  selector: 'app-listing-typography',
  templateUrl: './listing-typography.html',
  styleUrls: ['./listing-typography.scss'],
  imports: [],
})
export class ListingTypography {
  public orderListData = Data.orderListData;
  public listingTypographyUL = Data.listingTypograhyULData;
}
