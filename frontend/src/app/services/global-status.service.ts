import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalStatusService {
  private loading = signal(false);

  isLoading = this.loading.asReadonly();
  setLoading(value: boolean) {
    this.loading.set(value);
  }
}
