import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ProgressBar from './progress-bar';
import { toast } from 'react-toastify';

const ExportButton = ({
    filename = '',
    exportColumnConfig,
    data,
    pagination,
    handleGetAll,
}) => {
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    const prepareDataForExport = (dataToExport) => {
        return dataToExport.map((item, index) => {
            const exportItem = {};
            const exportColumns = exportColumnConfig(pagination);
            exportColumns.forEach(col => {
                exportItem[col.name] = col.getValue(item, index);
            });
            return exportItem;
        });
    };

    const exportToExcel = async (data = [], exportAll = false) => {
        setIsExporting(true);
        setExportProgress(0);
        try {
            setExportProgress(10);
            let dataExport = data;
            if (exportAll) {
                const response = await handleGetAll();
                if (response) {
                    dataExport = response.data;
                }
            }
            setExportProgress(30);
            const exportData = prepareDataForExport(dataExport);

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

            setExportProgress(70);

            const fileName = `${filename}_${exportAll ? 'all' : 'current'}_${new Date().toISOString().split('T')[0]}.xlsx`;
            setExportProgress(90);
            XLSX.writeFile(workbook, fileName);
            setExportProgress(100);

        } catch (error) {
            toast.error('Có Lỗi xảy ra khi export Excel');
            setIsExporting(false);
            setExportProgress(0);
        }
    };

    const exportToCSV = async (data = [], exportAll = false) => {
        setIsExporting(true);
        setExportProgress(10);
        try {
            let dataExport = data;
            if (exportAll) {
                const response = await handleGetAll();
                if (response) {
                    dataExport = response.data;
                }
            }
            setExportProgress(50);

            const exportData = prepareDataForExport(dataExport);

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            setExportProgress(80);

            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const fileName = `${filename}_${exportAll ? 'all' : 'current'}_${new Date().toISOString().split('T')[0]}.csv`;
            saveAs(blob, fileName);
            setExportProgress(100);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi export CSV');
            setIsExporting(false);
            setExportProgress(0);
        }
    };

    const handleProgressComplete = () => {
        setIsExporting(false);
        setExportProgress(0);
    };

    return (
        <>
            <div className="dropdown">
                <button
                    className="btn btn-outline-primary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    disabled={isExporting}
                >
                    <Icon icon="mdi:download" className="me-1" />
                    {isExporting ? 'Đang xuất...' : 'Xuất Dữ Liệu'}
                </button>
                <ul className="dropdown-menu">
                    <li><h6 className="dropdown-header">Dữ liệu hiện tại</h6></li>
                    <li>
                        <button className="dropdown-item" onClick={() => exportToExcel(data, false)}>
                            <Icon icon="mdi:microsoft-excel" className="me-2 text-danger" />
                            Excel - {pagination.per_page} dòng
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item" onClick={() => exportToCSV(data, false)}>
                            <Icon icon="mdi:file-delimited" className="me-2 text-info" />
                            CSV - {pagination.per_page} dòng
                        </button>
                    </li>
                    <li><h6 className="dropdown-header">Tất cả dữ liệu</h6></li>
                    <li>
                        <button className="dropdown-item" onClick={() => exportToExcel(data, true)}>
                            <Icon icon="mdi:microsoft-excel" className="me-2 text-danger" />
                            Excel - {pagination.total} dòng
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item" onClick={() => exportToCSV(data, true)}>
                            <Icon icon="mdi:file-delimited" className="me-2 text-info" />
                            CSV - {pagination.total} dòng
                        </button>
                    </li>
                </ul>
            </div>
            <ProgressBar
                progress={exportProgress}
                isVisible={isExporting}
                onComplete={handleProgressComplete}
            />
            {isExporting && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"
                    style={{ zIndex: 1040 }}
                />
            )}
        </>
    );
};

export default ExportButton;