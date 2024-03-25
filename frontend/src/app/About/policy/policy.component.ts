import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  backToShop() {
    this.router.navigateByUrl('/');
  }

}
