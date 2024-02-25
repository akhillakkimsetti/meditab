import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Customer, FormControls } from '../enums/enum';
import { TableService } from './table.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [MessageService],
})
export class TableComponent implements OnInit {
  formControls = FormControls;
  searchForm: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    chartNo: new FormControl(''),
    address: new FormControl(''),
    fullSearch: new FormControl(''),
  });
  customers: Customer[];
  loading: boolean = true;
  statuses: any[];
  representatives;
  filteredCustomers: Customer[] = [];
  constructor(private tableService: TableService) {}

  ngOnInit(): void {
    this.searchForm.get('fullSearch')?.valueChanges.subscribe((val) => {
      let nameRegex = /\\(\w+)/;
      let lastNameRegex = /@(\w+)/;
      let chartNoRegex = /#(\w+)/;
      let addressRegex = /\$(\w+)/;

      let nameMatch = val.match(nameRegex);
      let lastNameMatch = val.match(lastNameRegex);
      let chartNoMatch = val.match(chartNoRegex);
      let addressMatch = val.match(addressRegex);

      this.searchForm.get('firstName').patchValue(nameMatch?.[1]);
      this.searchForm.get('lastName').patchValue(lastNameMatch?.[1]);
      this.searchForm.get('chartNo').patchValue(chartNoMatch?.[1]);
      this.searchForm.get('address').patchValue(addressMatch?.[1]);
    });
    this.tableService.getCustomersLarge().then((val) => {
      this.customers = val;
      this.filteredCustomers = [...val];
      this.loading = false;
    });
  }

  onChange(controlName: string, index: number) {
    let val = this.searchForm.get(controlName)?.value;
    let fullSearchVal = this.searchForm.get('fullSearch')?.value;
    let parts = this.searchForm.get('fullSearch')?.value.split(/[\\@#$]/);
    if (parts.length >= index + 1) {
      parts[index] = val;
    }

    if (parts.length <= 1 && controlName === FormControls.firstName) {
      this.searchForm.get('fullSearch')?.patchValue('\\' + val);
    } else if (parts.length <= 2 && controlName === FormControls.firstName) {
      parts[1] = val;
      this.searchForm
        .get('fullSearch')
        ?.patchValue(this.joinWithSymbols(parts.slice(1, parts.length)));
    }

    if (parts.length <= 2 && controlName === FormControls.lastName) {
      this.searchForm.get('fullSearch')?.patchValue(fullSearchVal + '@' + val);
    } else if (parts.length <= 3 && controlName === FormControls.lastName) {
      parts[2] = val;
      this.searchForm
        .get('fullSearch')
        ?.patchValue(this.joinWithSymbols(parts.slice(1, parts.length)));
    } else if (parts.length <= 3 && FormControls.firstName === controlName) {
      parts[1] = val;
      this.searchForm
        .get('fullSearch')
        ?.patchValue(this.joinWithSymbols(parts.slice(1, parts.length)));
    }

    if (parts.length <= 3 && controlName === FormControls.chartNo) {
      this.searchForm.get('fullSearch')?.patchValue(fullSearchVal + '#' + val);
    } else if (parts.length <= 4 && controlName === FormControls.chartNo) {
      parts[3] = val;
      this.searchForm
        .get('fullSearch')
        ?.patchValue(this.joinWithSymbols(parts.slice(1, parts.length)));
    } else if (parts.length <= 4 && FormControls.lastName === controlName) {
      parts[2] = val;
      this.searchForm
        .get('fullSearch')
        ?.patchValue(this.joinWithSymbols(parts.slice(1, parts.length)));
    } else if (parts.length <= 4 && FormControls.firstName === controlName) {
      parts[1] = val;
      this.searchForm
        .get('fullSearch')
        ?.patchValue(this.joinWithSymbols(parts.slice(1, parts.length)));
    }

    if (parts.length <= 4 && controlName === FormControls.address) {
      this.searchForm.get('fullSearch')?.patchValue(fullSearchVal + '$' + val);
    } else if (parts.length <= 5 && controlName === FormControls.address) {
      parts[4] = val;
      this.searchForm
        .get('fullSearch')
        ?.patchValue(this.joinWithSymbols(parts.slice(1, parts.length)));
    } else if (parts.length <= 5 && FormControls.chartNo === controlName) {
      parts[3] = val;
      this.searchForm
        .get('fullSearch')
        ?.patchValue(this.joinWithSymbols(parts.slice(1, parts.length)));
    } else if (parts.length <= 5 && FormControls.lastName === controlName) {
      parts[2] = val;
      this.searchForm
        .get('fullSearch')
        ?.patchValue(this.joinWithSymbols(parts.slice(1, parts.length)));
    } else if (parts.length <= 5 && FormControls.firstName === controlName) {
      parts[1] = val;
      this.searchForm
        .get('fullSearch')
        ?.patchValue(this.joinWithSymbols(parts.slice(1, parts.length)));
    }
  }

  joinWithSymbols(strings: string[]) {
    const symbols = ['\\', '@', '#', '$'];
    const maxLength = Math.min(strings.length, symbols.length);

    let result = '';
    for (let i = 0; i < maxLength; i++) {
      result += symbols[i] + strings[i];
    }

    if (strings.length > symbols.length) {
      result += strings.slice(maxLength).join('');
    }

    return result;
  }

  onSearch() {
    this.filteredCustomers = [];
    if (
      this.searchForm.get('fullSearch')?.value === '' &&
      this.searchForm.get('fullSearch').value === undefined
    ) {
      this.filteredCustomers = [...this.customers];
    }
    if (this.searchForm.get('firstName')?.value) {
      this.customers.map((customer) => {
        if (
          JSON.stringify(customer.name)
            .toLowerCase()
            .includes(this.searchForm.get('firstName')?.value.toLowerCase())
        ) {
          this.filteredCustomers.push(customer);
        }
      });
    }
    if (this.searchForm.get('lastName')?.value) {
      this.customers.map((customer) => {
        if (
          JSON.stringify(customer.lastname)
            .toLowerCase()
            .includes(this.searchForm.get('lastName')?.value.toLowerCase())
        ) {
          this.filteredCustomers.push(customer);
        }
      });
    }
    if (this.searchForm.get('chartNo')?.value) {
      this.customers.map((customer) => {
        if (
          JSON.stringify(customer.chart_no)
            .toLowerCase()
            .includes(this.searchForm.get('chartNo')?.value.toLowerCase())
        ) {
          this.filteredCustomers.push(customer);
        }
      });
    }
    if (this.searchForm.get('address')?.value) {
      this.customers.map((customer) => {
        if (
          JSON.stringify(customer.address)
            .toLowerCase()
            .includes(this.searchForm.get('address')?.value.toLowerCase())
        ) {
          this.filteredCustomers.push(customer);
        }
      });
    }
  }

  onClear() {
    this.searchForm.get('firstName')?.patchValue('');
    this.searchForm.get('lastName')?.patchValue('');
    this.searchForm.get('chartNo')?.patchValue('');
    this.searchForm.get('address')?.patchValue('');
    this.searchForm.get('fullSearch')?.patchValue('');

    this.filteredCustomers = [...this.customers];
  }
}
