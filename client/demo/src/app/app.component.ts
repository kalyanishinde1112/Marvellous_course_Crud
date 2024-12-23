import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BatchService } from './batch.service';
import { MarvellousDirective } from './marvellous.directive';
import { batchData } from './batchData.model';
import { TableComponent } from './table/table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  batches:any;
  dataForm!: FormGroup;
  isFormVisible: boolean = false; // Control visibility of the form
  isEditMode: boolean = false;
  currentBatchId: any = null;
  transformedData:any;
  constructor(private batchService: BatchService, private fb: FormBuilder) {}

 
  ngOnInit(): void {
    this.getBatches(); // Load all records
    this.createForm(); // Initialize the form

  }

  // Fetch all records
  getBatches(): void {
    this.batchService.getData().subscribe((data) => {
      this.batches = data;
    });
  }

  // Initialize the form
  createForm(): void {
    this.dataForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      fees: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      duration: ['', Validators.required],
    });
  }

  // Toggle form visibility
  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;

    if (!this.isFormVisible) {
      this.resetForm();
    }
  }

  // Add or Edit record
  onSubmit(): void {
    if (this.isEditMode && this.currentBatchId) {
      console.log(this.currentBatchId)
      this.updateRecord();
    } else {
      this.addRecord();
    }
  }
  get name(){
    return this.dataForm.controls['name']
  }
  get fees(){
    return this.dataForm.controls['fees']
  }
  get duration(){
    return this.dataForm.controls['duration']
  }
  // Add a new record
  addRecord(): void {
    this.batchService.postData(this.dataForm.value).subscribe(() => {
      alert('Record added successfully!');
      this.getBatches();
      this.toggleForm(); // Close the form after adding
    });
  }

  //setting value for ed

  // Edit an existing record
  editRecord(id: any): void {
    this.isFormVisible = true; // Show the form
    this.isEditMode = true;    // Set to edit mode
    this.currentBatchId = id;  // Set the current record ID
  
    this.batchService.getBatchByID(id).subscribe(
      (response: any) => {
        console.log('Received data for patching:', response); // Debugging log
        const data=response.data
        // Map the data to match form control keys
        if(data){}
        var newData = {
          name: data.name, // Update mappings as needed
          fees: data.fees,
          duration:data.duration
        };
  
        this.dataForm.patchValue(newData); // Patch the transformed data
        console.log('Form after patching:', this.dataForm.value); // Debugging log
      },
      (error) => {
        console.error('Error while fetching data:', error);
        alert('Unable to fetch the record.');
      }
    );
  }
  
  


  // Update an existing record
  updateRecord(): void {
    this.batchService
      .updateRecord(this.currentBatchId,this.dataForm.value)
      .subscribe(() => {
        alert('Record updated successfully!');
        this.getBatches();
        this.toggleForm(); // Close the form after updating
      });
  }

  // Delete a record
  deleteRecord(id: string): void {
    this.batchService.deleteBatch(id).subscribe(() => {
      alert('Record deleted successfully!');
      this.getBatches(); // Refresh the records
    });
  }

  // Reset the form
  resetForm(): void {
    this.dataForm.reset();
    this.isEditMode = false;
    this.currentBatchId = null;
  }

   
}