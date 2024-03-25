import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Item } from 'src/app/models/item';
import { CategoryService } from 'src/app/services/category.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {
  itemForm!: FormGroup;
  categories!: Category[];
  imageDisplay!: string | ArrayBuffer;
  isSubmitted = false;
  editMode = false;
  currentItemId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private itemService: ItemsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
    this.getCategories();
  }

  initForm(): void {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      image: [''],
      category: ['', Validators.required],
      newArrival: [false] 
    });
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.itemForm.patchValue({ image: file });
      this.itemForm.get('image')?.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result;
      };

      fileReader.readAsDataURL(file);
    }
  }
  checkEditMode(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.editMode = true;
        this.currentItemId = params['id'];
        this.itemService.getOneItem(params['id']).subscribe((item) => {
          this.itemForm.patchValue({
            name: item.name,
            description: item.description,
            price: item.price,
            image: null, 
            category: item.category._id, 
            newArrival: item.newArrival
          });
          this.imageDisplay = item.image;
        });
      }
    });
  }
  
  

  addItem(item: FormData): void {
    this.itemService.createItem(item).subscribe((item) => {
      this.snackBar.open('You added ' + this.itemForm.get('name').value + ' as a new Item', 'OK', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 4000
      });
    });
  }

  updateItem(item: FormData): void {
    this.itemService.updateItem(item, this.currentItemId).subscribe((item) => {
      this.snackBar.open('You updated ' + this.itemForm.get('name').value + ' Item', 'OK', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 4000
      });
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.itemForm.invalid) {
      return;
    }

    const itemData = new FormData();

    itemData.append('name', this.itemForm.get('name').value);
    itemData.append('description', this.itemForm.get('description').value);
    itemData.append('price', this.itemForm.get('price').value);
    itemData.append('image', this.itemForm.get('image').value);
    itemData.append('category', this.itemForm.get('category').value);
    itemData.append('newArrival', this.itemForm.get('newArrival').value.toString());

    if (this.editMode) {
      this.updateItem(itemData);
    } else {
      this.addItem(itemData);
    }

    setTimeout(() => {
      this.router.navigate(['/items/list']);
    }, 2000);
  }
}
