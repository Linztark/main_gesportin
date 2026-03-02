import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PayloadSanitizerService {
    sanitize(
    payload: any,
    config?: {
      booleanFields?: string[];
      nestedIdFields?: string[];
      idFieldMap?: { [nestedField: string]: string };
      removeFields?: string[]; // fields to remove from payload; supports dot paths like 'equipo.jugadores'
    },
  ): any {
    const copy: any = { ...payload };

    if (config?.booleanFields) {
      config.booleanFields.forEach((field) => {
        if (copy[field] === 1 || copy[field] === 0) {
          copy[field] = copy[field] === 1;
        } else {
          copy[field] = !!copy[field];
        }
      });
    }

    if (config?.nestedIdFields) {
      config.nestedIdFields.forEach((field) => {
        if (copy[field] && typeof copy[field] === 'object') {
          copy[field] = { id: Number(copy[field].id) };
        } else {
          const idKey = `id_${field}`;
          if (copy[idKey] !== undefined) {
            copy[field] = { id: Number(copy[idKey]) };
            delete copy[idKey];
          }
        }
      });
    }

    if (config?.idFieldMap) {
      Object.keys(config.idFieldMap).forEach((nestedField) => {
        const idKey = config.idFieldMap![nestedField];
        if (copy[nestedField] && typeof copy[nestedField] === 'object') {
          copy[nestedField] = { id: Number(copy[nestedField].id) };
        } else if (copy[idKey] !== undefined) {
          copy[nestedField] = { id: Number(copy[idKey]) };
          delete copy[idKey];
        }
      });
    }

    // remove specified derived fields; supports nested paths using dot notation
    if (config?.removeFields) {
      config.removeFields.forEach((fieldPath) => {
        if (!fieldPath) return;
        const parts = fieldPath.split('.');
        if (parts.length === 1) {
          delete copy[parts[0]];
        } else {
          let target: any = copy;
          for (let i = 0; i < parts.length - 1; i++) {
            if (target && typeof target === 'object' && parts[i] in target) {
              target = target[parts[i]];
            } else {
              target = null;
              break;
            }
          }
          if (target && typeof target === 'object') {
            delete target[parts[parts.length - 1]];
          }
        }
      });
    }

    return copy;
  }
}
