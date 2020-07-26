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

  // get meta data
  async getMeta(doc: string): Promise<number> {

    return this.db.collection('meta').doc(doc).get()
      .toPromise()
      .then((data) => {
        return data.data().count as number;
      });
  }

  // get meta data
  // -1 awb, -2 ref, -3 unknown, 0 success
  async checkIfExists(doc: string, field1: string, value1: string, field2?: string, value2?: string): Promise<number> {

    const query = this.db.collection(doc).ref.orderBy('id', 'desc');
    let isExists = 0;

    if (field2 && value2 && value2 !== '') {
      isExists = await this.db.collection(doc, () => query.where(field2, '==', value2)).get().toPromise()
          .then((value) => {
            if (value.size > 0) {
              return -2;
            }
            else {
              return 0;
            }
          })
          .catch((err) => {
            return -3;
          });
    } else {
      if (isExists !== -1) {
        isExists = await this.db.collection(doc, () => query.where(field1, '==', value1)).get().toPromise()
        .then((value) => {
          if (value.size > 0) {
            return -1;
          } else {
            return 0;
          }
        })
        .catch((err) => {
          return -3;
        });
      }
    }

    return isExists;
  }

  // create
  async createDocument(doc: string, data: any): Promise<number> {

    const isExists = await this.checkIfExists(doc, 'awbNumber', data.awbNumber, 'referenceNumber', data.referenceNumber);

    if (isExists === 0) {
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

    return isExists;
  }

  // read
  async getDocument(
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

    count = await this.getMeta(doc);

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

    // doc, (ref) => query.limit(limit)
    return this.db.collection(doc, () => query.limit(limit))
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
  async getNextDocument(
    doc: string,
    docId: string,
    limit: number,
    courier: number,
    shipmentMode: number,
    transportMode: number,
    doxType: number,
    shipmentStatus: number,
    searchText: string,
    searchField: string,
  ) {

    const count = await this.getMeta(doc);

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

    return this.db.collection(doc, () => query.startAfter(docId).limit(limit))
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
  async getPrevDocument(
    doc: string,
    docId: string,
    limit: number,
    courier: number,
    shipmentMode: number,
    transportMode: number,
    doxType: number,
    shipmentStatus: number,
    searchText: string,
    searchField: string,
  ) {

    const count = await this.getMeta(doc);

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

    return this.db.collection(doc, () => query.endBefore(docId).limitToLast(limit))
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
      .subscribe((data: any) => count = data.count);

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
    return this.db.collection('meta').doc(doc).get()
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

    if (data.statusId === 7) {
      updateData = {
        receivedPerson: receivedPerson || null,
        receivedPersonRelation: receivedPersonRelation || null,
        shipmentStatus: data.statusId || null,
        delivery: firestore.FieldValue.arrayUnion(data),
        updatedDateTime: data.updatedDateTime,
        updatedBy: data.updatedBy,
      };
    }
    else {
      updateData = {
        shipmentStatus: data.statusId || null,
        delivery: firestore.FieldValue.arrayUnion(data),
        updatedDateTime: data.updatedDateTime,
        updatedBy: data.updatedBy,
      };
    }

    const arrUnion = ref.update(updateData);
  }

}
