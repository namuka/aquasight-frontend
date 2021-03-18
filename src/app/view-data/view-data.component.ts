import { DatePipe } from '@angular/common';
import { Component, Directive, Input, OnInit, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppError } from '../common/app-error';
import { Unauthorized } from '../common/unauthorized';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DataService } from '../services/data.service';


class Data{
  id: number;
  flow: number;
  pressure: number;
  timeStamp: Date;

}

export type SortColumn = keyof Data | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: string | number | Date, v2: string | number | Date) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

@Component({
  selector: 'view-data',
  templateUrl: './view-data.component.html',
  styleUrls: ['./view-data.component.css'],
  /*providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]*/
})
export class ViewDataComponent implements OnInit {

  data : Data[];
  list: Data[];
  searchTerm: string;
  page = 1;
  pageSize = 5;
  collectionSize: number;

  constructor(private service: DataService, private router: Router, private modalService: NgbModal) { }

  public isCollapsed = false;

  public chartType: string = 'bar';

  public chartDatasets: Array<any> = [
    { data: [], label: 'Flow' },
    { data: [], label: 'Pressure' }
  ];

  public chartLabels: Array<any> = [];
  public barChartLegend = true;
  public barChartPlugins = [];

  public chartOptions: any = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}]}
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  ngOnInit(): void {

    this.service.getAll()
      .subscribe( resp => {
        this.data = resp;
        this.refreshData();
        this.collectionSize = this.data.length;
        this.chartDatasets[0].data = resp.map( one =>  one.flow) as any [];
        this.chartDatasets[1].data = resp.map( one =>  one.pressure) as any [];
        this.chartLabels =  resp.map( one =>  {
          let date = new Date(one.timeStamp);
          let day: string = date.getDate().toString();
          day = +day < 10 ? '0' + day : day;
          let month: string = (date.getMonth() + 1).toString();
          month = +month < 10 ? '0' + month : month;
          let year = date.getFullYear();
          let time = date.getHours() + ':' + date.getMinutes();
          return `${month}/${day}/${year}, ${time}`;
        }) as any [];
      },
      (error: AppError) => {
        if (error instanceof Unauthorized) {
          this.router.navigate(['/no-access']);
        }
        else throw error;
      });

  }

  refreshData() {
    this.list = this.data
      .map((one, i) => ({id: i + 1, ...one}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

    console.log(this.list);
  }

  search(value: number): void {
     this.list = this.data.filter((val) => val.flow===value);
    this.collectionSize = this.data.length;

  }

  pipe = new DatePipe('en-US');
  filterByDateRange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if(dateRangeStart.value !== '' && dateRangeEnd.value !== ''){
      /*this.list = this.data.filter(
        (val) => (new Date(val.timeStamp)>=new Date(dateRangeStart.value) && new Date(val.timeStamp)<=new Date(dateRangeEnd.value))
        ).slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);*/


        this.service.getByDateRange(this.pipe.transform(dateRangeStart.value, 'yyyy-MM-dd'),this.pipe.transform(dateRangeEnd.value, 'yyyy-MM-dd'))
        .subscribe( resp => {
          this.data = resp;
          this.refreshData();
        });
    }else{
      this.refreshData();
    }
  }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting data
    if (direction === '' || column === '') {
      this.refreshData();
    } else {
      this.list = [...this.data].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      })
      .map((one, i) => ({id: i + 1, ...one}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }

  closeResult: string;
  open(content) {
    this.modalService.open(content, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }


}
