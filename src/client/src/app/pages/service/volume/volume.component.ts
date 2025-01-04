import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-volume',
  templateUrl: './volume.component.html',
  styleUrls: ['./volume.component.scss']
})
export class VolumeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    $(document).ready(function () {
      $('#volumetric').on('propertychange change click keyup input paste', function () {
          $('#volOutputGroup').show();
          calcVolumetricWeight();
      });
  
      function calcVolumetricWeight() {
          var courier = Number($('#courier').val());
          var shipping = Number($('#shipping').val());
          var transport = Number($('#transport').val());
  
          var length = Number($('#length').val());
          var width = Number($('#width').val());
          var height = Number($('#height').val());
  
  
          $('#shipping').change(function () {
              if ($(this).val() == 1) {
                  $('#transport').attr("disabled", "disabled");
                  $('#transport').prop("selectedIndex", "1");
              }
              else {
                  $('#transport').removeAttr("disabled", "disabled");
              }
          });
  
          var output = $('#volOutput');
          output.text('');
          var dimFactor = $('#dimFactor');
          dimFactor.text('');
          $('#error-msg').text('');
  
          var volCase = 0;
  
          // If shipping = Air then same formula for all courier
          if (shipping == 1) {
              volCase = 1;    
          }
  
          // aramex
          else if (courier == 1) {
              if (transport == 1 || transport == 2) { volCase = 1 }
          }
          // bluedart
          else if (courier == 2) {
              if (transport == 1) { volCase = 1 }
              else if (transport == 2 || transport == 3) { volCase = 3 }
          }
          // common for dhl/tnt/ups
          else if (courier == 3 || courier == 11 || courier == 12) {
              if (transport == 1) { volCase = 1 }
          }
          // dtdc
          else if (courier == 4) {
              if (transport == 1) { volCase = 1 }
              else if (transport == 2) { volCase = 4 }
              else if (transport == 3) { volCase = 3 }
          }
          // fedex
          else if (courier == 5) {
              if (transport == 1 || transport == 2) { volCase = 1 }
              else if (transport == 3) { volCase = 3 }
          }
          // common for ff/french/ondot/trackon/SKYKING/shree tirupathi/shree maruthi/maruthi couriershree anjani/madhur courier/pooman courier
          else if (courier == 6 || courier == 7 || courier == 8 || courier == 10 || courier == 13 ||
              courier == 14 || courier == 15 || courier == 16 || courier == 17 || courier == 18 || courier == 19) {
              if (transport == 1) { volCase = 2 }
              else if (transport == 2) { volCase = 1 }
          }
          // overnite
          else if (courier == 9) {
              if (transport == 1) { volCase = 1 }
              else if (transport == 2) { volCase = 5 }
          }
          // if default value
          else if (courier == 100 || transport == 10) { volCase = 100 }
  
          switch (volCase) {
              case 1:
                  output.text(((length * width * height) / 5000).toFixed(2));
                  dimFactor.text("Dimension Weight factor = (L x W x H) in cm/5000 = Kilograms");
                  break;
              case 2:
                  output.text(((length * width * height) / 6000).toFixed(2));
                  dimFactor.text("Dimension Weight factor = (L x W x H) in cm/6000 = Kilograms");
                  break;
              case 3:
                  output.text(((length * width * height * 9) / 27000).toFixed(2));
                  dimFactor.text("Dimension Weight factor = (L x W x H x 9) in cm/27000 = Kilograms");
                  break;
              case 4:
                  output.text(((length * width * height) / 4750).toFixed(2));
                  dimFactor.text("Dimension Weight factor = (L x W x H) in cm/4750 = Kilograms");
                  break;
              case 5:
                  output.text(((length * width * height) / 4000).toFixed(2));
                  dimFactor.text("Dimension Weight factor = (L x W x H) in cm/4000 = Kilograms");
                  break;
  
              case 100:
                  output.text('0.00');
                  break;
  
              default:
                  $('#volOutputGroup').hide();
                  $('#error-msg').text('The selected courier does not have selected transport mode..');
          }
      };
  });
  }

}
