import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseFirestoreService {

  constructor(private db: AngularFirestore) { }

  // TODO: add failure condition

  // create
  async createDocument(doc: string, data: any) {
    return this.db.collection(doc).add(data);
  }

  // read
  getDocument(doc: string) {
    return this.db.collection(doc).snapshotChanges()
      .pipe(
        map((actions) => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  // update
  deleteDocument(doc: string, docId: string) {
    return this.db.collection(doc).doc(docId).delete();
  }

  // delete
  updateDocument(doc: string, docId: string, data: any) {
    return this.db.collection(doc).doc(docId).update(data);
  }

}
