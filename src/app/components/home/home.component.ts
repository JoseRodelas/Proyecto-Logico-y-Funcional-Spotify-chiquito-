import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentCategory: string = 'pop';
  showAllSongs: boolean = false;
  displayAllSongs: Song[] = [];

  ngOnInit(): void {
    this.loadSongs();
  }
  
  selectCategory(categoryId: string): void {
    this.currentCategory = categoryId;
    this.showAllSongs = false;
    this.loadSongs();
  }

  loadSongs(): void {
    this.displayedSongs = this.showAllSongs ? [...this.songs[this.currentCategory]] : this.songs[this.currentCategory].slice(0, 4);
  }

  toggleShowAll(): void {
    this.showAllSongs = !this.showAllSongs;
    this.loadSongs();
  }

  getCategoryName(): string {
    return this.categories.find(c => c.id === this.currentCategory)?.name || 'Musica';
  }

  playSong(song: Song): void {
    console.log(`Reproduciendo: ${song.title}`);
  }
  
}
