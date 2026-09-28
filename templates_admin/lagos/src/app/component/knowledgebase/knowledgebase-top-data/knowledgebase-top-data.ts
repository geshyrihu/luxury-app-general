import { Component } from '@angular/core';

import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';
import { knowledgebaseData } from '../../../shared/data/data/knowladgebase/knowladgebase';
import { CommanData } from '../../faq/comman-data/comman-data';

@Component({
  selector: 'app-knowledgebase-top-data',
  templateUrl: './knowledgebase-top-data.html',
  styleUrls: ['./knowledgebase-top-data.scss'],
  imports: [FeatherIcons, CommanData],
})
export class KnowledgebaseTopData {
  public knowledgebaseData = knowledgebaseData;
}
