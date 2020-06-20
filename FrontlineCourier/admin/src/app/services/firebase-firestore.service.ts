import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class FirebaseFirestoreService {

  constructor(private db: AngularFirestore) { }

  // TODO: add failure condition

  // create
  async createDocument(doc: string, data: any) {

    // get existing count
    this.db.collection('meta').doc(doc).get()
      .subscribe((db: any) => {
        // increment the count
        data.id = db.data().count + 1;

        // save the data
        this.db.collection(doc).doc((data.id).toString()).set(data);
        // update the count in meta
        this.db.collection('meta').doc(doc).set({ count: data.id });
      });
  }

  // read
  getDocument(doc: string, limit: number) {

    let count = 0;

    this.db.collection('meta').doc(doc).get()
      .subscribe((data: any) => count = data.count );

    return this.db.collection(doc, ref => ref.orderBy('id', 'desc').limit(limit))
      .snapshotChanges()
        .pipe(
          map((actions) => actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data, count };
          }))
        );
  }

  getNextDocument(doc: string, docId: string, limit) {

    let count = 0;

    this.db.collection('meta').doc(doc).get()
      .subscribe((data: any) => count = data.count );

    return this.db.collection(doc, ref => ref.orderBy('id', 'desc').startAfter(docId).limit(limit))
      .snapshotChanges()
        .pipe(
          map((actions) => actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data, count };
          }))
        );
  }

  getPrevDocument(doc: string, docId: string, limit) {

    let count = 0;

    this.db.collection('meta').doc(doc).get()
      .subscribe((data: any) => count = data.count );

    return this.db.collection(doc, ref => ref.orderBy('id', 'desc').endBefore(docId).limitToLast(limit))
      .snapshotChanges()
        .pipe(
          map((actions) => actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data, count };
          }))
        );
  }

  // update
  async deleteDocument(doc: string, docId: string) {
    // get existing count
    this.db.collection('meta').doc(doc).get()
      .subscribe((db: any) => {
        // decrement the count
        const count = db.data().count - 1;

        // delete the data
        this.db.collection(doc).doc(docId.toString()).delete();
        // update the count in meta
        this.db.collection('meta').doc(doc).set({ count });
      });
  }

  // delete
  updateDocument(doc: string, docId: string, data: any) {
    return this.db.collection(doc).doc(docId.toString()).update(data);
  }

  updateDocumentArray(doc: string, docId: string, data: any) {
    const ref = this.db.collection(doc).doc(docId.toString());

    const arrUnion = ref.update({
      delivery: firestore.FieldValue.arrayUnion(data)
    });
  }

}
