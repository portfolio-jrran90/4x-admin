<template>
  <div>
    <h2>Assign Category EmpatKali</h2>
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th>No</th>
          <th>Product</th>
          <th>Author</th>
          <th>Period</th>
          <th>Diskon</th>
          <th>Kategori</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in allPromotion" :id="'promo-id-'+data.No" class="promo-list">
          <td style="width: 5%">{{ data.No }}</td>
          <td style="width: 35%">
            <b>{{ data.title }}</b>
            <br>
            <img :src="data.img" style="height: 230px; width: 70%; object-fit: cover">
          </td>
          <td style="width: 10%">{{ data.author }}</td>
          <td style="width: 20%">{{ data.period }}</td>
          <td style="width: 10%">{{ data.diskon }}%</td>
          <td>
            <a href="#" @click.prevent="openModal('AssignCategory', data)">Assign a Category</a>
          </td>
        </tr>
        <tr v-if="allPromotion.length === 0">
          <td colspan="4">No transaction record!</td>
        </tr>
      </tbody>
    </table>

    <!-- ====================================== Modal ====================================== -->
    <b-modal v-model="modalShowAssignCategory" title="Assign a category" size="lg">
      <div class="row">
        <div class="col">
          <label for="selectCategory" style="color: #c4c4c4">
            <b>Category</b>
          </label>
          <table class="table table-bordered table-sm table-stiped">
            <tr v-for="data in modalOutputAssignCategory.cat">
              <td>{{ data.text }}</td>
              <td align="center">
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  @click.prevent="removeAssignedCategory(data.kategori)"
                >x</button>
              </td>
              <!-- <td>
                <a href="#" @click.prevent="removeAssignedCategory(data.No)">remove</a>
              </td>-->
            </tr>
          </table>
        </div>
        <div class="col">
          <form @submit.prevent="assignCategory">
            <div class="form-group">
              <label for="selectCategory" style="color: #c4c4c4">
                <b>Select Category</b>
              </label>
              <select class="form-control" id="selectCategory" v-model="dataInputAssignCategory">
                <option value>---</option>
                <option :value="data" v-for="data in categories">{{ data.Name }}</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">
              <b>Assign</b>
            </button>
          </form>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-secondary" @click="modalShowAssignCategory=false">Cancel</button>
      </div>
    </b-modal>
    <!-- ====================================== ./Modal ====================================== -->
  </div>
</template>

<script>
import VueTagsInput from "@johmun/vue-tags-input";
import axios from "axios";

export default {
  components: {
    VueTagsInput
  },
  computed: {
    checkedCategories() {
      return "awts";
    }
  },
  data() {
    return {
      allPromotion: {},
      transactionDetail: {},
      transactionDetailHeader: "",
      modalTransactionDetail: false,

      // Assigning of category
      modalShowAssignCategory: false,
      modalOutputAssignCategory: {},
      categories: {},

      dataInputAssignCategory: "",

      tag: [],
      tags: [],
      autoCompleteCategories: []
    };
  },
  created() {
    let vm = this;

    // vm.getCategories()

    /**
     * Get all promos
     */
    axios.get(`${process.env.VUE_APP_API_URL}/promo`).then(res => {
      vm.allPromotion = res.data;
      // convert cat_id to name
      for (let i = 0; i < vm.allPromotion.length; i++) {
        // loop categories under that promo
        let category = [];
        for (
          let j = 0;
          j < JSON.parse(vm.allPromotion[i].category).length;
          j++
        ) {
          // extract specific info
          axios
            .get(
              `${process.env.VUE_APP_API_URL}/category/${
                JSON.parse(vm.allPromotion[i].category)[j]
              }`
            )
            .then(resCat => {
              category.push({
                idpromo: vm.allPromotion[i].No,
                kategori: resCat.data[0].No,
                text: resCat.data[0].Name
              });
            });
        }
        vm.allPromotion[i]["cat"] = category;
        vm.tags = category;
      }
    });
  },
  methods: {
    getCategories(data) {
      axios.get(`${process.env.VUE_APP_API_URL}/category`).then(res => {
        this.categories = res.data;
        /*this.autoCompleteCategories = res.data.map(a => {
          return { idpromo: data.No, kategori: a.No, text: a.Name }
        })*/
      });
    },
    /**
     * Open modal
     */
    openModal(type, data, index) {
      let vm = this;
      switch (type) {
        case "AssignCategory":
          vm.modalShowAssignCategory = true;
          vm.modalOutputAssignCategory = data;
          vm.getCategories(data);
          break;
        default: //
      }
    },
    /**
     * Remove assigned category
     * @param  int id category id
     * @return {[type]}    [description]
     */
    removeAssignedCategory(id) {
      let vm = this;
      axios
        .post(`${process.env.VUE_APP_API_URL}/assigncategory`, {
          idpromo: parseInt(vm.modalOutputAssignCategory.No),
          kategori: id,
          del: 1
        })
        .then(res => {
          if (res.data.success == false) {
            alert("Delete tidak berhasil");
          } else {
            alert("Delete Berhasil");
            location.reload();
          }
        });
    },
    /**
     * Assigning a category
     */
    assignCategory() {
      let vm = this;
      axios
        .post(`${process.env.VUE_APP_API_URL}/assigncategory`, {
          idpromo: parseInt(vm.modalOutputAssignCategory.No),
          kategori: parseInt(vm.dataInputAssignCategory.No)
        })
        .then(res => {
          if (res.data.success == false) {
            alert("Data tidak berhasil");
          } else {
            alert("Data Berhasil");
            location.reload();
          }
          // alert("Successfully assigned!");
          // fix this later
          /*let setAssignedCategory = {
          idpromo: vm.modalOutputAssignCategory.No,
          kategori: vm.dataInputAssignCategory.No,
          text: vm.dataInputAssignCategory.Name
        }

        vm.modalOutputAssignCategory.cat.push(setAssignedCategory)*/
          // console.log('aw',vm.modalOutputAssignCategory.cat)
          // console.log("update categories", res.data);
        });
    },
    updateCategories(newCat) {
      /*{
        "idpromo": "1",
        "kategori":"5"
      }*/
      for (let i = 0; i < newCat.length; i++) {
        axios
          .post(`${process.env.VUE_APP_API_URL}/assigncategory`, {
            idpromo: parseInt(newCat[i].idpromo),
            kategori: parseInt(newCat[i].kategori)
          })
          .then(res => {
            console.log("update categories", res.data);
          });
      }
    }
  }
};
</script>
