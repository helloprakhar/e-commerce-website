import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Item } from 'src/app/models/item';
import { CategoryService } from 'src/app/services/category.service';
import { ItemsService } from 'src/app/services/items.service';
import { PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-new-arrival',
  templateUrl: './new-arrival.component.html',
  styleUrls: ['./new-arrival.component.css'],
})
export class NewArrivalComponent implements OnInit {
  newArrivalItems!: Item[];
  categories!: Category[];
  filter!: string;
  searchLaunch = false;
  searchDataFiltered!: Item[];
  searchForm!: FormGroup;
  priceFilterForm: FormGroup;
  pageSize = 16;
  pagedItems: Item[] = [];
  currentPage = 0;
  filteredItems: Item[] = [];

  constructor(
    private itemsService: ItemsService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filter = 'All';
    this.searchForm = this.formBuilder.group({
      term: [''],
    });
    this.priceFilterForm = this.formBuilder.group({
      maxPrice: [''],
    });
  }

  ngOnInit(): void {
    this.getNewArrivalItems();
    this.getCategories();
    this.priceFilterForm.get('maxPrice')?.setValue(this.getMaxPrice());
  }

  @ViewChild('categorySelect') categorySelect: MatSelect;

  getHikedPrice(originalPrice: number): number {
    const discountedPrice = originalPrice * 1.2;
    return Math.ceil(discountedPrice);
  }

  getNewArrivalItems(): void {
    this.itemsService.getAllItems().subscribe(
      (items) => {
        this.newArrivalItems = items.filter((item) => item.newArrival === true);
        this.priceFilterForm.get('maxPrice')?.setValue(this.getMaxPrice());
      this.applyPriceFilter(); 
        this.paginateItems();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  changeClient(value: string) {
    this.filter = value;
    this.priceFilterForm.reset();
    this.filterItems();
  }
  applyPriceFilter() {
    this.filterItems();
  }

  filterItems() {
    this.filteredItems = this.newArrivalItems.slice();

    const categoryFilter = this.filter !== 'All' ? this.filter : null;
    const maxPrice = this.priceFilterForm.get('maxPrice')?.value;
    const searchTerm = this.searchForm.get('term')?.value.toLowerCase();

    this.filteredItems = this.filteredItems.filter((item) => {
      const passCategoryFilter = !categoryFilter || item.category?.name === categoryFilter;
      const passPriceFilter = maxPrice === null || item.price <= maxPrice;
      const passSearchFilter = !searchTerm || item.name.toLowerCase().includes(searchTerm);

      return passCategoryFilter && passPriceFilter && passSearchFilter;
    });

    this.paginateItems();
  }

  onSubmit() {
    this.filterItems();
  }
  forwardToSingleItem(itemId: string) {
    this.router.navigate(['/items/single-item/' + itemId]);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateItems();
  }


  paginateItems() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedItems = this.filteredItems.slice(startIndex, endIndex);
  }
  getMaxPrice(): number {
    if (!this.newArrivalItems || this.newArrivalItems.length === 0) {
      return 0;
    }
    const maxPrice = Math.max(...this.newArrivalItems.map((item) => item.price));
    return maxPrice;
  }
  get showList(): boolean {
    return this.filteredItems.length > 0;
  }
}
