import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import { shipmentStatus } from '../models/shipmentStatus';


@Injectable({
  providedIn: 'root'
})
export class FirebaseFirestoreService {

  constructor(private db: AngularFirestore) { }

  // TODO: add failure condition

  // get meta data

  async getMeta(doc: string) {

    return this.db.collection('meta').doc(doc).get()
      .toPromise()
      .then((data) => {
        return data.data().count as number;
      });

  }

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
  async getDocument(doc: string, limit: number) {

    let count = 0;

    count = await this.getMeta(doc);

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

  // read next
  async getNextDocument(doc: string, docId: string, limit) {

    const count = await this.getMeta(doc);

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

  // read prev
  async getPrevDocument(doc: string, docId: string, limit) {

    const count = await this.getMeta(doc);

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

  // specific to booking
  async getSearchResultForBooking(
    doc: string,
    limit: number,
    courier: number,
    shipmentMode: number,
    transportMode: number,
    doxType: number,
    shipmentStatus: number,
    searchText: string,
    searchField: string,
    ) {

      let count = 0;

      this.db.collection('meta').doc(doc).get()
        .subscribe((data: any) => count = data.count );

      let query = this.db.collection(doc).ref.orderBy('id', 'desc');

      if (courier) {
        query = query.where('courier', '==', courier);
      }
      if (shipmentMode) {
        query = query.where('shipmentMode', '==', shipmentMode);
      }
      if (transportMode) {
        query = query.where('transportMode', '==', transportMode);
      }
      if (doxType) {
        query = query.where('doxType', '==', doxType);
      }
      if (shipmentStatus) {
        query = query.where('shipmentStatus', '==', shipmentStatus);
      }
      if (searchText && searchField) {
        query = query.where(searchField, '==', searchText);
      }

      return this.db.collection(doc, (ref) => query.limit(limit))
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

  // update
  async updateDocument(doc: string, docId: string, data: any) {
    return this.db.collection(doc).doc(docId.toString()).update(data);
  }

  // update array
  async updateDocumentArray(
    doc: string, docId: string, data: any, receivedPerson: string, receivedPersonRelation: string) {
    const ref = this.db.collection(doc).doc(docId.toString());

    let updateData: any;

    if (data.statusId === 7)
    {
      updateData = {
        receivedPerson: receivedPerson || null,
        receivedPersonRelation: receivedPersonRelation || null,
        shipmentStatus: data.statusId || null,
        delivery: firestore.FieldValue.arrayUnion(data)
      };
    }
    else
    {
      updateData = {
        shipmentStatus: data.statusId || null,
        delivery: firestore.FieldValue.arrayUnion(data)
      };
    }

    const arrUnion = ref.update(updateData);
  }

}
