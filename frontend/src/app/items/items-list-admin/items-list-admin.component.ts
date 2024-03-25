import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemDialogComponent } from 'src/app/dialogs/item-dialog/item-dialog.component';
import { Item } from 'src/app/models/item';
import { ItemsService } from 'src/app/services/items.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-items-list-admin',
  templateUrl: './items-list-admin.component.html',
  styleUrls: ['./items-list-admin.component.css'],
})
export class ItemsListAdminComponent implements OnInit {
  items!: Item[];
  displayedColumns: string[] = ['name', 'image', 'category', 'edit', 'delete'];

  constructor(private itemService: ItemsService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.getItems();
  }

  getItems() {
    this.itemService.getAllItems().subscribe((items) => {
      this.items = items;
      // console.log(items);
    });
  }

  onDeleteItem(item: Item) {
    const dialogRef = this.dialog.open(ItemDialogComponent, {
      width: '400px',
      data: { name: item.name },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.itemService.deleteItem(item._id).subscribe((item) => {
          this.getItems();
        });
      }
    });
  }

  backToShop() {
    this.router.navigateByUrl('/');
  }
}
