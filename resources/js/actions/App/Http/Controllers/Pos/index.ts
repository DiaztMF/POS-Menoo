import DashboardController from './DashboardController'
import MenuController from './MenuController'
import PosController from './PosController'
import ReportController from './ReportController'
import CategoryController from './CategoryController'
const Pos = {
    DashboardController: Object.assign(DashboardController, DashboardController),
MenuController: Object.assign(MenuController, MenuController),
PosController: Object.assign(PosController, PosController),
ReportController: Object.assign(ReportController, ReportController),
CategoryController: Object.assign(CategoryController, CategoryController),
}

export default Pos