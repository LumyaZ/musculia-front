import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export abstract class GenericService<T> {
    protected abstract endpoint: string;

    constructor(protected http: HttpClient) {}

    protected get apiUrl(): string {
        return `${environment.apiUrl}/${this.endpoint}`;
    }

    // Récupérer tous les éléments
    findAll(): Observable<T[]> {
        return this.http.get<T[]>(this.apiUrl);
    }

    // Récupérer un élément par son ID
    findById(id: number): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}/${id}`);
    }

    // Créer un nouvel élément
    create(item: T): Observable<T> {
        return this.http.post<T>(this.apiUrl, item);
    }

    // Mettre à jour un élément
    update(id: number, item: T): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}/${id}`, item);
    }

    // Supprimer un élément
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Recherche générique
    search(criteria: any): Observable<T[]> {
        return this.http.get<T[]>(`${this.apiUrl}/search`, { params: criteria });
    }
} 