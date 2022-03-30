import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TarifaApolloI} from '../../interfaces/tarifas/tarifa-apollo.interface';
import {TarifasApolloConfService} from '../../services/tarifas-apollo-conf.service';

@Component({
  selector: 'app-frecuencia-conf',
  templateUrl: './frecuencia-conf.component.html',
  styleUrls: ['./frecuencia-conf.component.scss'],
})
export class FrecuenciaConfComponent implements OnInit, OnChanges {

  @Input() modelo: 'vehiculo' | 'tarifas_categorias';
  @Input() modelo_id: number;
  @Input() precio_base: number;

  @Input() tarifaApolloPayload: TarifaApolloI[];
  applyTarifasRules = false;
  constructor(
    private tarifasApolloConfSer: TarifasApolloConfService
  ) { }

  async ngOnInit() {

  }

  async ngOnChanges(changes: SimpleChanges) {
    let tarifaApolloChange = changes.tarifaApolloPayload;
    let precioBaseChange = changes.precio_base;


    if (tarifaApolloChange && (tarifaApolloChange.firstChange === true || tarifaApolloChange.isFirstChange() === false)) {
      await this.initTarifaApolloObj(this.tarifaApolloPayload);
    }

    if (precioBaseChange && (precioBaseChange.firstChange === true || precioBaseChange.isFirstChange() === false)) {
      if (this.precio_base) {
        this.recalTarifaRow();
      }
    }
  }

  async initTarifaApolloObj(data?) {
    // TODO: pasar a una tabla configuración en DB
    if (data) {
      this.tarifaApolloPayload = null;
      this.tarifaApolloPayload = data;
      return;
    }
    let payload = {
      model: this.modelo
    }
    await this.loadTarifaApolloConf(payload);
    //this.recalTarifaRow();
  }

  async loadTarifaApolloConf(payload?) {

    let res = await this.tarifasApolloConfSer._getActive(payload);
    if (res.ok) {
      this.tarifaApolloPayload = [];
      for (let i = 0; i < res.data.length; i++) {
        this.tarifaApolloPayload.push(
          {
            id: null,
            frecuencia: res.data[i].frecuencia,
            frecuencia_ref: res.data[i].frecuencia_ref,
            activo: res.data[i].activo,
            modelo: this.modelo,
            modelo_id: this.modelo_id ? this.modelo_id : null,
            precio_base: this.precio_base,
            precio_final_editable: res.data[i].precio_final_editable,
            ap_descuento: res.data[i].ap_descuento,
            valor_descuento: res.data[i].valor_descuento,
            descuento: null,
            precio_final: this.precio_base,
            required: res.data[i].required,
            errors: []
          }
        )
      }
    }
  }

  recalTarifaRow(tarifaApollo?: TarifaApolloI) {
    console.log('recalTarifaRow');
    if (tarifaApollo) {
      let _valorDes = parseFloat(Number(tarifaApollo.valor_descuento / 100).toFixed(4));
      let _descuento = parseFloat(Number(tarifaApollo.precio_base * _valorDes).toFixed(4));
      let _total = parseFloat(Number(tarifaApollo.precio_base - _descuento).toFixed(4));

      tarifaApollo.descuento = _descuento;
      tarifaApollo.precio_final = _total;
    } else {
      if (this.tarifaApolloPayload && this.tarifaApolloPayload.length > 0) {
        for (let i = 0; i < this.tarifaApolloPayload.length; i++) {
          this.tarifaApolloPayload[i].precio_base = this.precio_base;

          let _valorDes = parseFloat(Number(this.tarifaApolloPayload[i].valor_descuento / 100).toFixed(4));
          let _descuento = parseFloat(Number(this.tarifaApolloPayload[i].precio_base * _valorDes).toFixed(4));
          let _total = parseFloat(Number(this.tarifaApolloPayload[i].precio_base - _descuento).toFixed(4));

          this.tarifaApolloPayload[i].descuento = _descuento;
          this.tarifaApolloPayload[i].precio_final = _total;

          if (this.tarifaApolloPayload[i].frecuencia_ref == 'hours') {
            this.tarifaApolloPayload[i].precio_final = parseFloat(Number(this.tarifaApolloPayload[i].precio_base / 7).toFixed(2));
          }
        }
      }
    }
    this.reviewTarifaCapture();
  }

  reviewTarifaCapture(): boolean {
    return true;
    let _haveErrors;
    if (this.tarifaApolloPayload && this.tarifaApolloPayload.length > 0) {
      for (let i = 0; i < this.tarifaApolloPayload.length; i++) {
        if (this.tarifaApolloPayload[i].required) {
          if (!this.tarifaApolloPayload[i].frecuencia || this.tarifaApolloPayload[i].frecuencia === '' || this.tarifaApolloPayload[i].frecuencia === 'undefined') {
            if (!this.tarifaApolloPayload[i].errors.find(x => x === 'Debe indicar una frecuencia valída')) {
              this.tarifaApolloPayload[i].errors.push('Debe indicar una frecuencia valída');
            }
          } else {
            this.tarifaApolloPayload[i].errors = [];
          }


          if (!this.tarifaApolloPayload[i].frecuencia_ref || this.tarifaApolloPayload[i].frecuencia_ref === '' || this.tarifaApolloPayload[i].frecuencia_ref === 'undefined') {
            if (!this.tarifaApolloPayload[i].errors.find(x => x === 'Debe indicar una referencia de frecuencia valída')) {
              this.tarifaApolloPayload[i].errors.push('Debe indicar una referencia de frecuencia valída');
            }
          } else {
            this.tarifaApolloPayload[i].errors = [];
          }

          if (!this.tarifaApolloPayload[i].modelo || this.tarifaApolloPayload[i].modelo === '' || this.tarifaApolloPayload[i].modelo === 'undefined') {
            if (!this.tarifaApolloPayload[i].errors.find(x => x === 'Debe indicar un modelo de datos correcto')) {
              this.tarifaApolloPayload[i].errors.push('Debe indicar un modelo de datos correcto');
            }
          } else {
            this.tarifaApolloPayload[i].errors = [];
          }

          if (!this.tarifaApolloPayload[i].modelo_id || this.tarifaApolloPayload[i].modelo_id == 0) {
            if (!this.tarifaApolloPayload[i].errors.find(x => x === 'Debe primero guardar la información del vehículo para proceder')) {
              this.tarifaApolloPayload[i].errors.push('Debe primero guardar la información del vehículo para proceder');
            }
          } else {
            this.tarifaApolloPayload[i].errors = [];
          }

          if (!this.tarifaApolloPayload[i].precio_base || this.tarifaApolloPayload[i].precio_base == 0) {
            if (!this.tarifaApolloPayload[i].errors.find(x => x === 'Debe indicar un precio base valído')) {
              this.tarifaApolloPayload[i].errors.push('Debe indicar un precio base valído');
            }
          } else {
            this.tarifaApolloPayload[i].errors = [];
          }

          if (this.tarifaApolloPayload[i].ap_descuento === true && !this.tarifaApolloPayload[i].valor_descuento || this.tarifaApolloPayload[i].valor_descuento == 0) {
            if (!this.tarifaApolloPayload[i].errors.find(x => x === 'Debe indicar un valor de descuento valído')) {
              this.tarifaApolloPayload[i].errors.push('Debe indicar un valor de descuento valído');
            }
          } else {
            this.tarifaApolloPayload[i].errors = [];
          }

          if (!this.tarifaApolloPayload[i].precio_final || this.tarifaApolloPayload[i].precio_final == 0) {
            if (!this.tarifaApolloPayload[i].errors.find(x => x === 'Debe indicar el precio final')) {
              this.tarifaApolloPayload[i].errors.push('Debe indicar el precio final');
            }
          } else {
            this.tarifaApolloPayload[i].errors = [];
          }

          if (this.tarifaApolloPayload[i].errors.length > 0) {
            _haveErrors = true;
          }
        }

      }
      if (_haveErrors === true) {
        return false;
      } else {
        return true
      }
    }
  }

  captureFinalPrice(tarifaApollo, event) {
    tarifaApollo.precio_final =  event.replace(/[$,]/g, "");
    console.log('typeof', typeof event);
    console.log(event);

    this.reviewTarifaCapture();
  }

}
