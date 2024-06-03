sap.ui.define(
  ["sap/ui/core/mvc/ControllerExtension", "sap/m/MessageBox"],
  function (ControllerExtension, MessageBox) {
    "use strict";

    return ControllerExtension.extend(
      "com.airdit.agpp.administrator.admin.ext.controller.AdminPageExt",
      {
        // this section allows to extend lifecycle hooks or hooks provided by Fiori elements
        override: {
          /**
           * Called when a controller is instantiated and its View controls (if available) are already created.
           * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
           * @memberOf com.airdit.agpp.administrator.admin.ext.controller.AdminPageExt
           */
          onInit: function () {
            // you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
            var oModel = this.base.getExtensionAPI().getModel();
          },
        },
        onAddAdmin: function () {
          this.createFragment = sap.ui.xmlfragment(
            "com.airdit.agpp.administrator.admin.ext.fragments.AddAdmin",
            this
          );
          this.getView().addDependent(this.createFragment);
          this.createFragment.open();

          // var jsonModel = new sap.ui.model.json.JSONModel({ result: [{ name: "AAAAAA" }, { name: "Bbbbbbbbb" }] });
          // this.getView().setModel(jsonModel, "jsonMod");
        },
        onSubmitAdd: function () {
          var that = this;
          let oModel = this.getView().getModel();
          let oBindList = oModel.bindList("/administrators");

          let userName = sap.ui.getCore().byId("userName").getValue();
          let firstName = sap.ui.getCore().byId("firstName").getValue();
          let middleName = sap.ui.getCore().byId("middleName").getValue();
          let lastName = sap.ui.getCore().byId("lastName").getValue();
          let emails = sap.ui.getCore().byId("email").getValue();
          let mobileNo = sap.ui.getCore().byId("mobileNo").getValue();
          let adminType = sap.ui.getCore().byId("adminType").getSelectedKey();
          let account = sap.ui.getCore().byId("account").getSelectedKey();

          const data = {
            username: userName,
            name: firstName,
            lastname: lastName,
            email: emails,
            phone: mobileNo,
            adminType: adminType,
            departments: account,
          };
          oBindList.create(data);

          oBindList
            .requestContexts()
            .then((req) => {
              that.getView().getModel().refresh();
              that.createFragment.destroy();
              MessageBox.success("User Created successfully");
            })
            .catch((err) => MessageBox.error(err));
        },
        onAdminChange: function () {
          const that = this;
          const adminType = sap.ui.getCore().byId("adminType").getSelectedKey();

          if (adminType === "Quality User" || adminType === "Power User") {
            sap.ui.getCore().byId("account").setEditable(true);

            let oModel = this.getView().getModel();
            let oBindList = oModel.bindList(`/deptName`);

            let aFilter = new sap.ui.model.Filter(
              "name",
              sap.ui.model.FilterOperator.EQ,
              adminType
            );
            const accountArray = [];
            oBindList
              .filter(aFilter)
              .requestContexts()
              .then(function (aContexts) {
                aContexts.forEach((oContext) => {
                  accountArray.push(oContext.getObject());
                });
                console.log(accountArray);
                var jsonModel = new sap.ui.model.json.JSONModel({
                  result: accountArray,
                });
                that.getView().setModel(jsonModel, "jsonMod");
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            sap.ui.getCore().byId("account").setEditable(false);
          }
        },
        onCloseAdd: function () {
          this.createFragment.destroy();
        },
        onEditAdmin: function () {
          let aContexts = this.base.getExtensionAPI().getSelectedContexts();
          if (aContexts.length === 1) {
            let oContext = aContexts[0];
            let oData = oContext.getObject();
            debugger;
            this.editFragment = sap.ui.xmlfragment(
              "com.airdit.agpp.administrator.admin.ext.fragments.EditAdmin",
              this
            );
            this.getView().addDependent(this.editFragment);
            this.editFragment.open();

            sap.ui.getCore().byId("userName").setValue(oData.username);
            sap.ui.getCore().byId("firstName").setValue(oData.name);
            sap.ui.getCore().byId("middleName").setValue(oData.middlename);
            sap.ui.getCore().byId("lastName").setValue(oData.lastname);
            sap.ui.getCore().byId("email").setValue(oData.email);
            sap.ui.getCore().byId("mobileNo").setValue(oData.phone);
            sap.ui.getCore().byId("adminType").setSelectedKey(oData.adminType);
            sap.ui.getCore().byId("account").setSelectedKey(oData.departments);
          } else {
            sap.m.MessageBox.error("Please Select only One User");
            return;
          }
        },

        onSubmitEdit: function () {
          var that = this;
          that.getView().setBusy(true);
          let filterName = this.base
            .getExtensionAPI()
            .getSelectedContexts()[0]
            .getValue().username;

          let userName = sap.ui.getCore().byId("userName").getValue();
          let firstName = sap.ui.getCore().byId("firstName").getValue();
          // let middleName = sap.ui.getCore().byId("middleName").getValue();
          let lastName = sap.ui.getCore().byId("lastName").getValue();
          let emails = sap.ui.getCore().byId("email").getValue();
          let mobileNo = sap.ui.getCore().byId("mobileNo").getValue();
          let adminType = sap.ui.getCore().byId("adminType").getSelectedKey();
          let account = sap.ui.getCore().byId("account").getSelectedKey();

          let oModel = this.getView().getModel();
          let oBindList = oModel.bindList("/BTPUser");
          let aFilter = new sap.ui.model.Filter(
            "username",
            sap.ui.model.FilterOperator.EQ,
            filterName
          );

          oBindList
            .filter(aFilter)
            .requestContexts()
            .then(function (aContexts) {
              aContexts[0].setProperty("username", userName);
              aContexts[0].setProperty("name", firstName);
              aContexts[0].setProperty("lastname", lastName);
              aContexts[0].setProperty("email", emails);
              aContexts[0].setProperty("phone", mobileNo);
              aContexts[0].setProperty("adminType", adminType);
              aContexts[0].setProperty("account", account);
              that.updateFragment.destroy();
              that.getView().getModel().refresh();
              MessageBox.success("User Updated successful");
              that.getView().setBusy(false);
            })
            .catch((err) => {
              MessageBox.error("Error is : " + err);
              that.getView().setBusy(false);
            });
        },
        onCloseEdit: function () {
          this.editFragment.destroy();
        },
      }
    );
  }
);
